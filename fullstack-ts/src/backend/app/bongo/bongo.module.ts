import { bongodb, webframework } from "../../../core";

let client: bongodb.BongoDBClient;

const getClient = (options?: any) => {
  if (!client) {
    client = new bongodb.BongoDBClient(options);
  }
  return client;
}

@webframework.Module({})
export class BongoModule {

  static forRoot(options?: any): webframework.Provider {
    return {
      provide: 'DATABASE_CONNECTION',
      value: getClient(options),
    };
  }

}