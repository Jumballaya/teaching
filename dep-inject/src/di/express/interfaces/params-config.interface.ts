
type param = 'req' | 'res' | `header:${string}` | `param:${string}` | `body:${string}` | `query:${string}`;

export interface ParamsConfigEntry {
  param: param;
  position: number;
}

export interface ParamsConfig {
  [key: string | symbol]: Array<ParamsConfigEntry>;
}