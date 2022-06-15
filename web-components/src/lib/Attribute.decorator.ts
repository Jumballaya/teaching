import 'reflect-metadata';


export const Attribute = () =>
  (target: any, propKey: string) => {
    const attrList: string[] = Reflect.getMetadata('attrList', target.constructor) || [];
    attrList.push(propKey);
    const list = Array.from(new Set(attrList));
    Reflect.defineMetadata('attrList', list, target.constructor);
  }