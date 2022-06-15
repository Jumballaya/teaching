import { Module } from "../../../di";
import { MainController } from "./Main.controller";
import { MainService } from "./Main.service";

@Module({
  controllers: [MainController],
  services: [MainService],
})
export class MainModule { }
