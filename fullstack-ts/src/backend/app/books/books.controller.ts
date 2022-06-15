import { webframework } from '../../../core';
import { BooksService } from "./books.service";

@webframework.Controller('/books')
export class BooksController {

  constructor(
    private readonly $books: BooksService,
  ) { }


  @webframework.Get('/')
  public getBooks() {
    return this.$books.getBooks();
  }

  @webframework.Get('/:id')
  public getBook(@webframework.Param('id') id: string) {
    return this.$books.getBook(id);
  }
}