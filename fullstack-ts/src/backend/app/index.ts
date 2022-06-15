import { webframework } from "../../core";
import { AppModule } from "./AppModule";


const main = async () => {
  const app = webframework.AppFactory.create(AppModule);

  app.listen(3000);
}

main();