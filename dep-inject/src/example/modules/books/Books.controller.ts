import { map, Observable } from "rxjs";
import { Get, Controller, Delete, Param, Post, Body, Put, Query, Headers } from "../../../di";
import { ApiResponse } from "../common/interfaces/api-response.interface";
import { LoggerService } from "../common/Logger.service";
import { BooksService } from "./Books.service";
import { Book } from "./interfaces/book.interface";

@Controller('/books')
export class BooksController {

  constructor(
    private readonly $logger: LoggerService,
    private readonly $books: BooksService,
  ) { }

  @Post('/')
  createBook(@Body() body: Omit<Book, 'id'>): Observable<ApiResponse<Book>> {
    this.$logger.log('[POST] -- /books')
    return this.$books.createBook(body).pipe(
      map(book => ({ success: true, status: 201, payload: book }))
    );
  }

  @Get('/')
  getBooks(): Observable<ApiResponse<Book[]>> {
    this.$logger.log('[GET] -- /books');
    return this.$books.getBooks().pipe(
      map(books => ({ success: true, status: 200, payload: books }))
    );
  }

  @Get('/:id')
  getBookById(@Param('id') id: string): Observable<ApiResponse<Book | null>> {
    this.$logger.log(`[GET] -- /books/${id}`);
    return this.$books.getBookById(parseInt(id)).pipe(
      map(book => ({ success: true, status: 200, payload: book }))
    );
  }

  @Put('/:id')
  updateBook(@Param('id') id: string, @Body() updates: Partial<Book>): Observable<ApiResponse<Book | null>> {
    this.$logger.log(`[PUT] -- /books/${id}`);
    return this.$books.updateBookById(parseInt(id), updates).pipe(
      map(book => ({ success: !!book, status: !!book ? 201 : 404, payload: book }))
    );
  }

  @Delete('/:id')
  deleteBookById(@Param('id') id: string): Observable<ApiResponse<Book | null>> {
    this.$logger.log(`[DELETE] -- /books/${id}`);
    return this.$books.deleteBookById(parseInt(id)).pipe(
      map(book => ({ success: !!book, status: !!book ? 200 : 404, payload: book }))
    );
  }

}