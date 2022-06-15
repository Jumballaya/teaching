import { Constructable } from "./constructable.interface";

export interface ModuleConfig {
  services?: Constructable[];
  controllers?: Constructable[];
  modules?: Constructable[];
}