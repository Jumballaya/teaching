import { Injectable } from '..';
import { beforeEach, describe, expect, it } from '../../test';
import { Inject } from './Inject';
import { Injector } from "./Injector";

let i = 0;
@Injectable()
class X {
  public id = i++;
  constructor() { }
}

class Y {
  constructor(public id: X) {
    this.id.id;
  }
}

@Injectable()
class A {
  constructor(public x: X) {
    this.x.id;
  }
}

@Injectable()
class Z {
  constructor(public x: X, public a: A) {
    this.x.id;
  }
}

const stringKey = 'SOME_KEY';
const symKey = Symbol(stringKey);

@Injectable()
class B {
  constructor(
    @Inject(stringKey)
    public str: { some: string; },

    @Inject(symKey)
    public symbol: { some: string; },
  ) {
    this.str.some;
    this.symbol.some;
  }
}

describe('Injector', () => {

  let injector: Injector;

  beforeEach(() => {
    i = 0;
    injector = new Injector();
  });

  it('Can be created', () => {
    expect(injector).toExist();
  });

  it('Can hold and inject a class', () => {
    injector.registerInstance(X);
    const out = injector.getInstance(X);
    expect(out).toBeInstanceOf(X);
  });

  it('Returns same instance of a class each time', () => {
    expect(i).toBe(0);
    injector.registerInstance(X);
    expect(i).toBe(1);
    const out = injector.getInstance(X) as X;
    expect(out).toBeInstanceOf(X);
    expect(out.id).toBe(0);
    const x = new X();
    expect(i).toBe(2);
    expect(x.id).toBe(1);
    const out2 = injector.getInstance(X) as X;
    expect(out2.id).toBe(out.id);
    expect(i).toBe(2);
  });

  it('Throws error when used without an Injectable class', () => {
    expect(() => injector.registerInstance(Y)).toThrow();
  });

  it('Injects values into constructors', () => {
    injector.registerInstance(Z);
    const z = injector.getInstance(Z) as Z;
    expect(z).toExist();
    const x = injector.getInstance(X) as X;
    expect(x).toExist();
    const a = injector.getInstance(A) as A;
    expect(a).toExist();

    expect(a.x.id).toEqual(z.x.id);
    expect(z.x.id).toEqual(x.id);
  });

  it('Can set and retreive providers', () => {
    injector.registerProvider(stringKey, { some: 'value' });
    const provider = injector.getProvider<{ some: string; }>('SOME_KEY') || { some: '' };
    expect(provider.some).toEqual('value');
  });

  it('Injects providers with the @Inject decorator', () => {
    injector.registerProvider(stringKey, { some: 'value' });
    injector.registerProvider(symKey, { some: 'value2' });
    injector.registerInstance(B);
    const b = injector.getInstance(B) as B;
    expect(b.str.some).toEqual('value');
    expect(b.symbol.some).toEqual('value2');
  });

});