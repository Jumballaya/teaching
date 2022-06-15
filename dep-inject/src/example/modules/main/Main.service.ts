import { Injectable } from "../../../di";

@Injectable()
export class MainService {

  public doSomething() {
    return {
      hello: 'world',
    };
  }
}