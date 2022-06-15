import express, { Request, Response, Router } from "express";
import * as bodyParser from 'body-parser';
import { Observable } from 'rxjs'
import { Injector } from "../core/Injector";
import { Constructable } from "../core/interfaces/constructable.interface";
import { ModuleConfig } from "../core/interfaces/module-config.interface";
import { RouteConfig } from "./interfaces/route-config.interface";
import { ParamsConfigEntry } from "./interfaces/params-config.interface";


export class Application {

  private app = express();

  constructor(mod: Constructable) {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.setupModules([mod]);
  }

  public listen(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(port, () => {
          console.log(`DI Framework listening on port ${port}`);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  public applyModule(mod: Constructable) {
    this.setupModules([mod]);
  }

  private setupModules(modules: Constructable[]) {
    const mods = modules.map(m => new m());
    for (const mod of mods) {
      const config: ModuleConfig = Reflect.getMetadata('config', mod.constructor);
      const injector: Injector = Reflect.getMetadata('injector', mod.constructor);
      if (injector) {
        const controllers = config
          ?.controllers
          ?.map(inst => injector.getInstance(inst)) || [];
        this.setupControllers(controllers);
      }
      if (config.modules) {
        this.setupModules(config.modules)
      }
    }
  }

  private setupControllers(controllers: Constructable[]) {
    for (const instance of controllers) {
      const ctor = instance.constructor;
      const path: string = Reflect.getMetadata('path', ctor);
      const routes: RouteConfig[] = Reflect.getMetadata('routes', ctor);
      const router = Router();
      for (const route of routes) {
        this.setupRoute(route, router, instance);
      }
      this.app.use(path, router);
    }
  }

  private setupRoute(route: RouteConfig, router: Router, controllerInstance: Constructable) {
    if (router[route.method]) {
      router[route.method](route.path, (req, res) => {
        try {
          this.handleRoute(controllerInstance, route, req, res);
        } catch (e) {
          console.log(e);
          this.handleRouteFailure(req, res, e);
        }
      });
    }
  }

  private handleRoute(controllerInstance: any, route: RouteConfig, req: Request, res: Response) {
    const ctor = controllerInstance.constructor;
    const params = this.buildParams(req, res, route, ctor);
    const routeResponse = controllerInstance[route.methodName](...params);
    if (routeResponse instanceof Promise) {
      return routeResponse.catch((e) => {
        return this.handleRouteFailure(req, res, e);
      }).then(response => {
        res.send(response);
      });
    }
    if (routeResponse instanceof Observable) {
      return routeResponse.subscribe(response => {
        res.send(response);
      });
    }
    res.send(routeResponse);
  }

  private buildParams(req: Request, res: Response, route: RouteConfig, ctor: Constructable) {
    const paramSheet = Reflect.getMetadata('params', ctor);
    if (!paramSheet) {
      return [];
    }
    const paramList = paramSheet[route.methodName] || [];
    const params: unknown[] = [];
    for (const param of paramList) {
      params[param.position] = this.buildParam(req, res, param);
    }
    return params;
  }

  private buildParam(req: Request, res: Response, param: ParamsConfigEntry) {
    if (param.param === 'req') {
      return req;
    }
    if (param.param === 'res') {
      return res;
    }
    if (param.param.startsWith('header:')) {
      const name = param.param.split('header:')[1];
      const value = name === '' ? req.headers : req.headers[name];
      return value;
    }
    if (param.param.startsWith('query:')) {
      const name = param.param.split('query:')[1];
      const value = name === '' ? req.query : req.query[name];
      return value;
    }
    if (param.param.startsWith('param:')) {
      const name = param.param.split('param:')[1];
      const value = name === '' ? req.params : req.params[name];
      return value;
    }
    if (param.param.startsWith('body:')) {
      const name = param.param.split('body:')[1];
      const value = name === '' ? req.body : req.body[name];
      return value;
    }
    return null;
  }

  private handleRouteFailure(req: Request, res: Response, e: any) {
    res.status(500).send({
      success: false,
      message: e?.message || 'error',
      detail: e?.detail || 'error detail'
    });
  }
}
