import { Constructable } from "./interfaces/constructable.interface";

export function Injectable() {
  return (ctor: Constructable): Constructable => {
    Reflect.defineMetadata('inject', [], ctor);
    return ctor;
  }
}