import { Observable } from "./Observable";
import { Subscription } from "./Subscription";

type MapFn<T, A> = (v: T) => A;
export const map = <T, A>(func: MapFn<T, A>) =>
  (obs: Observable<T>): Observable<A> => {
    return new Observable<A>(observer => {
      const next = (val: T) => {
        try {
          const next = func(val);
          observer.next(next);
        } catch (e) {
          console.log(e);
        }
      };
      const error = (err: Error) => {
        if (observer.error) observer.error(err)
      }
      const complete = () => {
        if (observer.complete) observer.complete();
      };
      const subscription = obs.subscribe(next, error, complete);
      return () => { subscription.unsubscribe };
    })
  }

type SwitchMapFn<T, A> = (v: T) => Observable<A>;
export const switchMap = <T, A>(func: SwitchMapFn<T, A>) => {
  let innerSub: Subscription;
  return (obs: Observable<T>): Observable<A> => {
    return new Observable<A>(observer => {
      const srcSub = obs.subscribe((val) => {
        if (innerSub) innerSub.unsubscribe();
        const innerObs = func(val);
        innerSub = innerObs.subscribe(
          (_val) => observer.next(_val),
          (_err) => observer.error ? observer.error(_err) : null,
          () => observer.complete ? observer.complete() : null,
        );
      })
      return () => {
        innerSub.unsubscribe();
        srcSub.unsubscribe();
      };
    })
  }
}
