import { Injector } from "../../injector";
import { ModuleConfig } from "./interfaces/module-config.interface";

export function Module(config: ModuleConfig) {
  const injector = new Injector();

  if (config.providers?.length && config.providers.length > 0) {
    for (const provider of config.providers) {
      const { provide, value } = provider;
      injector.registerProvider(provide, value);
    }
  }

  if (config.modules)
    config.modules.forEach(ctor => injector.registerInstance(ctor));
  if (config.services)
    config.services.forEach(ctor => injector.registerInstance(ctor));
  if (config.controllers)
    config.controllers.forEach(ctor => injector.registerInstance(ctor));

  return (ctor: any): any => {
    console.log(`[MODULE] -- Initializing module: ${ctor.name}`);
    Reflect.defineMetadata('config', config, ctor);
    Reflect.defineMetadata('injector', injector, ctor);
    return ctor;
  }
}