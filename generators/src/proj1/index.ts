import { Database } from "./Database";

interface Book {
  name: string;
  author: string;
}

const db = new Database();

const bookCollection = db.createCollection<Book>('books', 'Book');

bookCollection.insert({
  name: '20,000 Leagues Under the Sea',
  author: 'Jules Verne',
});

bookCollection.insert({
  name: 'Journey to the Center of the Earth',
  author: 'Jules Verne',
});

bookCollection.insert({
  name: 'Frankenstein',
  author: 'Jules Verne',
});

bookCollection.insert({
  name: 'The Time Machine',
  author: 'H. G. Wells',
});

bookCollection.updateById('2', { author: 'Mary Shelly' });
console.log(bookCollection.findById('2'));

console.log(bookCollection.queryObject({ author: 'Jules Verne' }));

bookCollection.deleteById('0');
console.log(bookCollection.queryObject({ author: 'Jules Verne' }));
