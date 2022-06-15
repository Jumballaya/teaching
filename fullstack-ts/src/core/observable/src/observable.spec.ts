import { of, from } from "./util";
import { map } from "./operators";
import { describe, expect, it } from "../../test";

describe('Observables: Observables', () => {

  it('Can be created', () => {
    const obs = of('string');
    expect(obs).toExist();
  });

  it('Can hold a value to return on subscription', () => {
    const obs = of('string');
    obs.subscribe(value => {
      expect(value).toEqual('string');
    });
  });

  it('Can transform into a promise', async () => {
    const promise = new Promise<number>((resolve) => {
      resolve(50);
    });

    const val = await from(promise).toPromise();
    expect(val).toBe(50);
  })

  it('Can hold a value on pipe', async () => {
    const val = await of('string').pipe(
      map(val => {
        return val;
      })
    ).toPromise();
    expect(val).toBe('string');
  });

  it('Can change value on a pipe', async () => {
    const val = await of('string').pipe(
      map(() => {
        return 30;
      })
    ).toPromise();
    expect(val).toBe(30);
  });

});