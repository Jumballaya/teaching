
export interface Command {

  collection?: {

    create?: {
      name: string;
      type: string;
    };

    read?: {
      name: string;
    }

    update?: {
      name: string;
      updates: {
        name?: string;
        type?: string;
      }
    }

    delete?: {
      name: string;
    }

  };

  entry?: {

    create?: {
      collection: string;
      payload: Record<string, unknown>[];
    };

    read?: {
      collection: string;
      query?: Record<string, unknown>;
    };

    update?: {
      collection: string;
      updates: Record<string, unknown>;
      query: Record<string, unknown>;
    };

    delete?: {
      collection: string;
      query?: Record<string, unknown>;
    };

  }

}