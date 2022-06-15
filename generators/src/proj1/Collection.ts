import { Indexable } from "./types/indexable.type";

export class Collection<T> {
  private data: Indexable<T>[] = [];
  private id = 0;

  constructor(public readonly name: string, public readonly type: string) { }

  static fromCollection<B>(collection: Collection<B>, name: string, type: string) {
    const col = new Collection<B>(name, type);
    col.data = collection.data;
    col.id = collection.id;
    return col;
  }

  public insert(item: T): Indexable<T> {
    const indexedItem = {
      _id: (this.id++).toString(),
      ...item,
    };
    this.data.push(indexedItem);

    return indexedItem;
  }

  public findById(id: string): Indexable<T> | null {
    const items = this.data.filter(item => item._id === id);
    if (items.length > 0) {
      const found = items[0];
      return found;
    }
    return null;
  }

  public updateById(id: string, update: Partial<T>): Indexable<T> | null {
    const index = this.data.findIndex(v => v._id === id);
    if (index !== -1) {
      const updatedEntry: Indexable<T> = {
        ...this.data[index],
        ...update,
      };
      this.data[index] = updatedEntry;
      return updatedEntry;
    }
    return null;
  }

  public deleteById(id: string): Indexable<T> | null {
    const index = this.data.findIndex(v => v._id === id);
    if (index !== -1) {
      const found = { ...this.data[index] };
      this.data = this.data.filter(v => v._id !== id);
      return found;
    }
    return null;
  }

  public queryObject(query: Partial<T>): Indexable<T>[] {
    if (query === {}) {
      return this.data;
    }
    const found = this.data.filter(item => this.matchObjects(query, item));
    return found;
  }

  private matchObjects(query: Partial<T>, indexed: Indexable<T>): boolean {
    let matching = true;
    for (const k in query) {
      const qValue = (k in query) ? query[k] : '';
      const iValue = (k in indexed) ? indexed[k] : '';
      const matches = qValue && iValue && (qValue === iValue);
      if (!matches) {
        matching = false;
      }
    }
    return matching;
  }
}