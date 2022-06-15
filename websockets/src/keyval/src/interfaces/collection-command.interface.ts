export interface CollectionCommand {

  create?: {
    name: string;
  };

  read?: {
    name: string;
  }

  update?: {
    name: string;
    updates: {
      name?: string;
    }
  }

  delete?: {
    name: string;
  }

}