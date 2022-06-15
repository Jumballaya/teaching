
type Subscribption = (name: string, data: string) => Promise<void>;

export class PubSub {
  // Map< Topic, Map< SubscriberName, Subscribption > >
  private topics: Map<string, Map<string, Subscribption>> = new Map();

  public subscribe(name: string, id: string, subscribtion: Subscribption) {
    if (!this.topics.has(name)) {
      this.topics.set(name, new Map());
    }
    const topic = this.topics.get(name);
    if (topic) {
      topic.set(id, subscribtion);
    }
  }

  public unsubscribe(name: string, id: string) {
    const topic = this.topics.get(name);
    if (topic) {
      return topic.delete(id);
    }
    return false;
  }

  public async publish(name: string, data: string) {
    const subs = this.topics.get(name) || [];
    for await (const [_, sub] of subs) {
      await sub(name, data);
    }
  }

}

