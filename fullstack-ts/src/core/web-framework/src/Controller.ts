import 'reflect-metadata';
import { Constructable } from "../../injector";

export function Controller(path: string): (ctor: Constructable) => Constructable {
  return function (ctor: Constructable) {
    console.log(`[CONTROLLER] -- Initializing controller: ${ctor.name}`);
    Reflect.defineMetadata('path', path, ctor);
    if (!Reflect.hasMetadata('routes', ctor)) {
      Reflect.defineMetadata('routes', [], ctor);
    }
    return ctor;
  }
}