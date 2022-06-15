import { Constructable } from "./interfaces/constructable.interface";
import 'reflect-metadata';


export class Injector {
  private injectMap: Map<Constructable, unknown> = new Map();

  public getInstance<T>(ctor: Constructable<T>): T {
    const instance = this.constructObject(ctor);
    return instance;
  }

  public registerInstance(ctor: Constructable): void {
    this.constructObject(ctor);
  }

  private constructObject<T>(ctor: Constructable<T>): T {
    const found = this.injectMap.get(ctor) as T;
    if (found) {
      return found;
    }

    const metadata: Constructable[] = Reflect.getMetadata('design:paramtypes', ctor);
    const argInstances = metadata?.map(con => this.constructObject(con)) || [];
    const constructed = new ctor(...argInstances);
    this.injectMap.set(ctor, constructed);
    return constructed;
  }
}