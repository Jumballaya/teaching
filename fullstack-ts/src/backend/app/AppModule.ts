import { webframework } from "../../core";
import { AlbumsController } from "./albums/albums.controller";
import { AlbumsService } from "./albums/albums.service";
import { BongoModule } from "./bongo/bongo.module";
import { BooksController } from "./books/books.controller";
import { BooksService } from "./books/books.service";


@webframework.Module({
  providers: [
    BongoModule.forRoot('bongodb://localhost:27127'),
  ],
  controllers: [
    AlbumsController,
    BooksController,
  ],
  services: [
    AlbumsService,
    BooksService,
  ]
})
export class AppModule { }
