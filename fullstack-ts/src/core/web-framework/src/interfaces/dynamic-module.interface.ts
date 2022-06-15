import { ModuleConfig } from "./module-config.interface";
import { ModuleCtor } from "./module-ctor.interface";

export interface DynamicModule extends ModuleConfig {
  module: ModuleCtor;
}