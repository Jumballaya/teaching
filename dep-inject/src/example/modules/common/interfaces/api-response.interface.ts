import { BaseResponse } from "./base-response.interface";

export interface ApiResponse<T> extends BaseResponse {
  payload: T;
}