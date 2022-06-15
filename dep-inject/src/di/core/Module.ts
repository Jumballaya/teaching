import { Injector } from "./Injector";
import { Constructable } from "./interfaces/constructable.interface";
import { ModuleConfig } from "./interfaces/module-config.interface";

export function Module(config: ModuleConfig) {
  const injector = new Injector();
  if (config.services) config.services.forEach(ctor => injector.registerInstance(ctor));
  if (config.controllers) config.controllers.forEach(ctor => injector.registerInstance(ctor));
  if (config.modules) config.modules.forEach(ctor => injector.registerInstance(ctor));
  return (ctor: Constructable): Constructable => {
    Reflect.defineMetadata('config', config, ctor);
    Reflect.defineMetadata('injector', injector, ctor);
    console.log(`[MODULE] -- Initializing module: ${ctor.name}`);
    return ctor;
  }
}