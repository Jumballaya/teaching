export interface Constructable<T = any> {
  new(...params: any[]): T;
}