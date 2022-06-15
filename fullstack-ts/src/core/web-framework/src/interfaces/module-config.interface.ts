import { Constructable } from "../../../injector";
import { Provider } from "./provider.interface";

export interface ModuleConfig {
  services?: Constructable[];
  controllers?: Constructable[];
  modules?: Constructable[];
  providers?: Provider[];
}