import { Injectable } from "../../../di";

@Injectable()
export class LoggerService {
  public log(...params: unknown[]) {
    console.log(...params);
  }
}