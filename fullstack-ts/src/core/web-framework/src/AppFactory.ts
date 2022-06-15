import { Application } from "./Application";
import { Constructable } from "../../injector";

export class AppFactory {

  static app: Application;

  static create(mod: Constructable): Application {
    if (!this.app) {
      this.app = new Application(mod);
    }
    this.app.applyModule(mod);
    return this.app;
  }
}