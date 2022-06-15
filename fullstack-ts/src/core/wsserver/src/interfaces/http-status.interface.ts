export interface HTTPStatus {
  method: string;
  path: string;
  protocol: {
    name: string;
    version: number;
  };
}
