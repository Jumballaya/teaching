import { Constructable } from "../core/interfaces/constructable.interface";
import { ParamsConfig } from "./interfaces/params-config.interface";

export function Query(name = '') {
  return function (target: Constructable, propKey: string | symbol, index: number) {
    if (!Reflect.hasMetadata('params', target.constructor)) {
      Reflect.defineMetadata('params', {}, target.constructor);
    }
    const data: ParamsConfig = Reflect.getMetadata('params', target.constructor);
    if (!data[propKey]) {
      data[propKey] = [];
    }
    data[propKey].push({ param: `query:${name}`, position: index });

    Reflect.defineMetadata('params', data, target.constructor);
  }
}