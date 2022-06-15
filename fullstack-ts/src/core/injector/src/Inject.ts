import { Constructable } from "../src/interfaces/constructable.interface";
import { ProviderConfig } from "../../web-framework/src/interfaces/provider-config.interface";

export function Inject(name: string | Symbol) {
  return function (target: Constructable, propKey: string | symbol, index: number) {

    if (!Reflect.hasMetadata('providers', target)) {
      Reflect.defineMetadata('providers', [], target);
    }
    const data: ProviderConfig[] = Reflect.getMetadata('providers', target);
    data.push({ provide: name, position: index });

    Reflect.defineMetadata('providers', data, target);
  }
}