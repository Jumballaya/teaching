import { Collection } from './Collection';
import { Database } from './Database';

interface Book {
  name: string;
  author: string;
}

const bookList = [
  {
    name: '20,000 Leagues Under the Sea',
    author: 'Jules Verne'
  },
  {
    name: 'Journey to the Center of the Earth',
    author: 'Jules Verne'
  },
  {
    name: 'The Time Machine',
    author: 'H.G. Wells'
  },
  {
    name: 'Frankenstein',
    author: 'Jules Verne'
  }
]

const db = new Database();

const collection: Collection<Book> = db.createCollection('books', 'Book');

console.log(collection);
collection.create(bookList);
console.log(collection);
collection.update({ _id: '3' }, { author: 'Mary Shelly' });
console.log(collection);
console.log(db.readCollection('books'));