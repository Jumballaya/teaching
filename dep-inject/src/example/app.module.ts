import { Module } from "../di";
import { BooksModule } from "./modules/books/Books.module";
import { MainModule } from "./modules/main/Main.module";

@Module({ modules: [BooksModule, MainModule] })
export class AppModule { }