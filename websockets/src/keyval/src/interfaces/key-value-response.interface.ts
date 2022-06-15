export interface KeyValueResponse<T = never> {
  success: boolean;
  message?: string;
  payload?: {
    key: string;
    value: T;
  };
}
