import { Collection } from "./Collection";

export class Store {

  private collections: Map<string, Collection<unknown>> = new Map();

  createCollection<T>(name: string) {
    const found = this.collections.get(name);
    if (!found || !this.collections.has(name)) {
      const col = new Collection<T>(name);
      this.collections.set(name, col);
      return col;
    }
    return found;
  }

  readCollection<T>(name: string) {
    return this.collections.get(name) as Collection<T> | undefined;
  }

  deleteCollection(name: string) {
    return this.collections.delete(name);
  }

}