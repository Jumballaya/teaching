export interface EntryCommand {


  create?: {
    collection: string;
    payload: {
      key: string;
      value: unknown;
    }
  };

  read?: {
    collection: string;
    key: string;
  };

  update?: {
    collection: string;
    updates: Record<string, unknown>;
    key: string;
  };

  delete?: {
    collection: string;
    key: string;
  };

}