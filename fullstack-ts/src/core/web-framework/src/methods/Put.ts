import 'reflect-metadata';
import { RouteConfig } from '../interfaces/route-config.interface';


export function Put(path: string) {
  return function (
    target: any,
    propKey: string,
  ) {
    const ctor = target.constructor;
    console.log(`[ROUTE - PUT] -- Initializing route ${path} on controller ${ctor.name}`);
    if (!Reflect.hasMetadata('routes', ctor)) {
      Reflect.defineMetadata('routes', [], ctor);
    }
    const routes: RouteConfig[] = Reflect.getMetadata('routes', ctor);
    routes.push({
      methodName: propKey,
      method: 'put',
      path,
    });
    Reflect.defineMetadata('routes', routes, ctor);
  }
}