import * as path from 'path';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from "../../../di";
import { FileSystemService } from "../common/FileSystem.service";
import { Book } from "./interfaces/book.interface";

@Injectable()
export class BooksService {

  private filePath = path.resolve(__dirname, '../../../..', './src/example/data/books.json');

  constructor(private readonly $fs: FileSystemService) { }

  public createBook(data: Omit<Book, 'id'>): Observable<Book> {
    return this.getBooks().pipe(
      switchMap(books => {
        const count = books.length;
        const book = { ...data, id: count + 1 };
        books.push(book);
        return this.saveBooks(books).pipe(map(() => book));
      }));
  }

  public getBooks(): Observable<Book[]> {
    return this.$fs.readFile(this.filePath).pipe(
      map(buffer => {
        const books: Book[] = JSON.parse(buffer.toString());
        return books;
      }));
  }

  public getBookById(id: number): Observable<Book | null> {
    return this.getBooks().pipe(
      map(books => {
        const found = books.filter(b => b.id === id);
        if (found.length > 0) {
          return found[0];
        }
        return null;
      })
    )
  }

  public updateBookById(id: number, updates: Partial<Book>): Observable<Book | null> {
    return this.getBooks().pipe(
      switchMap(books => {
        const index = books.findIndex(b => b.id === id);
        if (index >= 0) {
          books[index] = { ...books[index], ...updates };
          return this.saveBooks(books).pipe(map(() => books[index]));
        }
        return of(null);
      })
    )
  }

  public deleteBookById(id: number): Observable<Book | null> {
    return this.getBooks().pipe(
      switchMap(books => {
        const found = books.filter(b => b.id === id);
        if (!isNaN(id) && found.length > 0) {
          const newBooks = books.filter(b => b.id !== id);
          return this.saveBooks(newBooks).pipe(
            map(() => {
              return found[0];
            }));
        }
        return of(null);
      })
    )

  }

  private saveBooks(books: Book[]): Observable<void> {
    const data = JSON.stringify(books, null, 2);
    const promise = this.$fs.writeFile(this.filePath, data);
    return from(promise);
  }
}