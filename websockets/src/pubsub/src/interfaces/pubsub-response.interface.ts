export interface PubSubResponse {
  success: boolean;
  topic: string;
  payload?: string;
  message?: string;
}