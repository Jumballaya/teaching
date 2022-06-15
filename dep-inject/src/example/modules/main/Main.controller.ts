import { Controller, Get } from "../../../di";
import { ApiResponse } from "../common/interfaces/api-response.interface";
import { MainService } from "./Main.service";

@Controller('/')
export class MainController {

  constructor(private readonly $main: MainService) { }

  @Get('')
  public homePage(): ApiResponse<{ hello: string; }> {
    return {
      success: true,
      status: 200,
      payload: this.$main.doSomething()
    };
  }
}