import { bongodb, injector } from "../../../core/";

interface Book {
  author: string;
  title: string;
}

@injector.Injectable()
export class BooksService {

  constructor(
    @injector.Inject('DATABASE_CONNECTION')
    private connection: bongodb.BongoDBClient,
  ) { }

  public async getBooks() {
    const bookCol = await this.connection.getCollection<Book>('books', 'Book');
    return await bookCol.read<Book>({});
  }

  public async getBook(id: string) {
    const bookCol = await this.connection.getCollection<Book>('books', 'Book');
    return await bookCol.read({ _id: id });
  }
}
