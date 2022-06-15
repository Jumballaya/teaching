import { Observer } from "./interfaces/observer.interface";
import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";

type InitFunction<T> = (observer: Observer<T>) => () => void;
type OperatorFunction<T, A> = (obs: Observable<T>) => Observable<A>;

export class Observable<T> {

  constructor(private readonly initFunction: InitFunction<T>) { }

  public subscribe(
    next: (v: T) => void,
    error?: (v: Error) => void,
    complete?: () => void
  ): Subscription {
    const subscription = new Subscription();
    const observer = this.createObserver(next, error, complete);
    const subscriber = new Subscriber(observer, subscription);
    const teardown = this.initFunction(subscriber);
    subscription.add(teardown);
    return subscription;
  }

  public pipe(): Observable<T>;
  public pipe<A>(fn: OperatorFunction<T, A>): Observable<A>;
  public pipe<A, B>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>): Observable<B>;
  public pipe<A, B, C>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>, fn3: OperatorFunction<B, C>): Observable<C>;
  public pipe<A, B, C, D>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>, fn3: OperatorFunction<B, C>, fn4: OperatorFunction<C, D>): Observable<D>;
  public pipe(...ops: any[]) {
    if (ops.length > 0) {
      return ops.reduce((observable, op) => op(observable), this)
    }
    return this;
  }


  private createObserver(
    next: (v: T) => void,
    error?: (v: Error) => void,
    complete?: () => void
  ): Observer<T> {
    const obs: Observer<T> = { next };
    if (error) obs.error = error;
    if (complete) obs.complete = complete;
    return obs;
  }
}