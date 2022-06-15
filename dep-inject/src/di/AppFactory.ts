import { Application } from "./express/Application";
import { Constructable } from "./core/interfaces/constructable.interface";

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