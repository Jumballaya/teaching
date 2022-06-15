import { BaseResponse } from "./base-response.interface";

export interface ErrorResponse extends BaseResponse {
  detail: string;
  message: string;
}