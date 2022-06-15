import { AppFactory } from "../di";
import { AppModule } from "./app.module";

async function boostrap() {
    const app = AppFactory.create(AppModule);
    app.listen(3000);
}

boostrap();