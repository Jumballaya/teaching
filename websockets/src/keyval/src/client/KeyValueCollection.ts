import { KeyValueResponse } from "../interfaces/key-value-response.interface";
import { KeyValueClient } from "./KeyValueClient";

export class KeyValueCollection<T> {

  constructor(private client: KeyValueClient, private name: string) { }

  async create(key: string, value: T): Promise<KeyValueResponse> {
    const command = JSON.stringify({
      entry: {
        create: {
          collection: this.name,
          payload: { key, value },
        }
      }
    });
    return this.client.send<KeyValueResponse>(command);
  }

  async read(key: string): Promise<KeyValueResponse<T>> {
    const command = JSON.stringify({
      entry: {
        read: {
          collection: this.name,
          key,
        }
      }
    });
    return this.client.send<KeyValueResponse<T>>(command);
  }

  async update(key: string, updates: Partial<T>): Promise<KeyValueResponse<T>> {
    const command = JSON.stringify({
      entry: {
        update: {
          collection: this.name,
          key,
          updates,
        }
      }
    });
    return this.client.send<KeyValueResponse<T>>(command);
  }

  async delete(key: string): Promise<KeyValueResponse<boolean>> {
    const command = JSON.stringify({
      entry: {
        delete: {
          collection: this.name,
          key,
        }
      }
    });
    return this.client.send<KeyValueResponse>(command);
  }
}