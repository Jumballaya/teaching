
export class Collection<T> {

  private items: Map<string, T> = new Map();

  constructor(private _name: string) { }

  get name() {
    return this._name;
  }

  public create(k: string, v: T) {
    this.items.set(k, v);
    return v;
  }

  public read(k: string) {
    return this.items.get(k);
  }

  public update(k: string, update: Partial<T>) {
    const found = this.items.get(k);
    if (found) {
      if (typeof found === 'object') {
        const updated = { ...found, ...update };
        this.items.set(k, updated);
        return updated;
      } else {
        const updated = (found as any) + update;
        this.items.set(k, updated);
        return updated;
      }
    }
    this.create(k, update as T);
  }

  public delete(k: string) {
    return this.items.delete(k);
  }

  public has(k: string) {
    return this.items.has(k);
  }
}