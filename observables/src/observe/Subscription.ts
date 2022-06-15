export class Subscription {

  private teardowns: Array<() => void> = [];

  public add(teardown: () => void): void {
    this.teardowns.push(teardown);
  }

  public unsubscribe() {
    for (const teardown of this.teardowns) {
      teardown();
    }
    this.teardowns = [];
  }

}