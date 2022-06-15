export interface RouteConfig {
  path: string;
  method: 'get' | 'post' | 'delete' | 'options' | 'put',
  methodName: string;
}