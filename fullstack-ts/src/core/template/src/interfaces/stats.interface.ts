export interface Entry {
  raw: string;
  command: string;
  index: number;
}

export interface ForStat {
  rendered: string;
  raw: string;
  body: string;
  start: Entry;
  end?: Entry;
}

export interface IfStat {
  rendered: string;
  raw: string;
  if: IfElseEntry;
  else?: IfElseEntry;
  end?: Entry;
}

export interface IfElseEntry extends Entry {
  body: string;
}

export interface Stats<T> {
  rendered: string;
  raw: string;
  data: T;
  for: Array<ForStat>;
  if: Array<IfStat>;
}