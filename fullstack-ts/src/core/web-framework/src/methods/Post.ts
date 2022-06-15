import 'reflect-metadata';
import { RouteConfig } from '../interfaces/route-config.interface';


export function Post(path: string) {
  return function (
    target: any,
    propKey: string,
  ) {
    const ctor = target.constructor;
    console.log(`[ROUTE - POST] -- Initializing route ${path} on controller ${ctor.name}`);
    if (!Reflect.hasMetadata('routes', ctor)) {
      Reflect.defineMetadata('routes', [], ctor);
    }
    const routes: RouteConfig[] = Reflect.getMetadata('routes', ctor);
    routes.push({
      methodName: propKey,
      method: 'post',
      path,
    });
    Reflect.defineMetadata('routes', routes, ctor);
  }
}