import { Observer } from "./interfaces/observer.interface";
import { Subscription } from "./Subscription";

export class Subscriber<T> {

  private closed = false;

  constructor(
    private observer: Observer<T>,
    private subscription: Subscription,
  ) {
    this.subscription.add(() => { this.closed = true; });
  }

  next(value: T) {
    if (!this.closed) {
      this.observer.next(value);
    }
  }

  error(err: Error) {
    if (!this.closed) {
      this.closed = true;
      if (this.observer.error) {
        this.observer.error(err);
      }
      this.subscription.unsubscribe();
    }
  }

  complete() {
    if (!this.closed) {
      this.closed = true;
      if (this.observer.complete) {
        this.observer.complete();
      }
      this.subscription.unsubscribe();
    }
  }
}