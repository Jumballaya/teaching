export interface DecodeState {
  cursor: number;
  data: {
    fin: number;
    length: number;
    payload: string;
  };
}