import { from, of, map, switchMap } from "./observe";

const waitFor = <T>(ms: number, data: T) =>
  new Promise<T>((resolve) => {
    setTimeout(() => { resolve(data); }, ms);
  });

const obs = of(77).pipe(
  switchMap(v => {
    return from(waitFor(1000, { hello: 'world' }));
  }),
  map(v => {
    return 10;
  }),
  map(n => {
    return `There are ${n} Apples`;
  }),
  map(s => {
    return new Date();
  })
).pipe(
  map(d => {
    return { 'a': 'apple' };
  }),
  map(o => {
    return 17;
  }),
  map(n => {
    return { name: 'Patrick', age: 32 };
  }),
  switchMap(v => {
    return from(waitFor(1000, { ...v, date: new Date() })).pipe(
      map(i => {
        return { ...i, id: 50 };
      })
    )
  })
);

obs.subscribe((v) => {
  console.log(v)
});