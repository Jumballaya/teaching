import { Provider } from "./provider.interface";

export interface ModuleCtor<T = any> {
  new(...params: any[]): T;
  forRoot(options?: any): Provider;
}