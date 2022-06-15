import { Observable } from "./Observable";

export const of = <T>(v: T): Observable<T> => {
  return new Observable<T>(observer => {
    observer.next(v);
    if (observer.complete) observer.complete();
    return () => { };
  })
}

export const from = <T>(promise: Promise<T>): Observable<T> => {
  return new Observable<T>(observer => {
    promise.then((v: T) => {
      observer.next(v);
      if (observer.complete) observer.complete();
    }).catch(e => {
      if (observer.error) observer.error(e);
      if (observer.complete) observer.complete();
    });
    return () => { };
  });
}

export const interval = (action: () => void, period: number) => {
  return new Observable<NodeJS.Timer>(observer => {
    const id = setInterval(() => action(), period);
    observer.next(id);
    return () => {
      clearInterval(id);
    }
  });
}
