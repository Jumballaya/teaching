import 'reflect-metadata';
import { Constructable } from "./interfaces/constructable.interface";
import { ProviderConfig } from "../../web-framework/src/interfaces/provider-config.interface";


export class Injector {
  private injectMap: Map<Constructable, unknown> = new Map();
  private injectValueMap: Map<string | Symbol, any> = new Map();

  public getInstance<T>(ctor: Constructable<T>): T | undefined {
    return this.injectMap.get(ctor) as T;
  }

  public registerInstance(ctor: Constructable): void {
    this.constructObject(ctor);
  }

  public getProvider<T>(provide: string | Symbol): T | undefined {
    return this.injectValueMap.get(provide);
  }

  public registerProvider<T>(provide: string | Symbol, value: T): void {
    const found = this.injectValueMap.get(provide);
    if (found) {
      return;
    }
    this.injectValueMap.set(provide, value);
    if ((value as any).constructor) {
      this.injectMap.set((value as any).constructor, value);
    }
  }

  public addInjector(injector: Injector) {
    for (const [k, v] of injector.injectMap) {
      if (!this.injectMap.has(k)) {
        this.injectMap.set(k, v);
      }
    }
    for (const [k, v] of injector.injectValueMap) {
      if (!this.injectValueMap.has(k)) {
        this.injectValueMap.set(k, v);
      }
    }
    return this;
  }

  private constructObject<T>(ctor: Constructable<T>): T {
    const _injector: Injector | undefined = Reflect.getMetadata('injector', ctor);
    if (_injector) {
      this.addInjector(_injector);
    }

    const found = this.injectMap.get(ctor) as T;
    if (found) {
      return found;
    }

    const metadata: Constructable[] = Reflect.getMetadata('design:paramtypes', ctor);
    const argInstances = metadata?.map(con => this.constructObject(con)) || [];
    const providers: ProviderConfig[] = Reflect.getMetadata('providers', ctor);
    providers?.forEach(p => {
      const ctor = metadata[p.position];
      const provided = this.getProvider(p.provide);
      let constructed: any;
      if (provided instanceof ctor) {
        constructed = provided;
      } else {
        constructed = new ctor(provided || '');
      }
      if (constructed instanceof String) {
        argInstances[p.position] = '' + constructed;
      } else if (constructed instanceof Number) {
        argInstances[p.position] = +constructed;
      } else if (constructed instanceof Boolean) {
        argInstances[p.position] = !!constructed;
      } else {
        argInstances[p.position] = constructed;
      }
    });
    const constructed = new ctor(...argInstances);
    this.injectMap.set(ctor, constructed);
    return constructed;
  }
}