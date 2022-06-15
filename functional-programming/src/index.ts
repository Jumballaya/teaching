
type None = null | undefined;
type Option<T> = T | None;

interface Book {
  author: string;
  title: string;
}

const unwrap = <T>(opt: Option<T>): T => {
  if (opt !== null && opt !== undefined) {
    return opt as T;
  }
  throw new Error(`Unable to unwrap: ${JSON.stringify(opt)}`);
}

const apply = <T>(init: T, ...fns: Array<(item: T) => T>) =>
  fns.reverse().reduce((item, fn) => fn(item), init);

const booksKeys: Array<keyof Book> = ['author', 'title'];
const books: Array<[Book[keyof Book], Book[keyof Book]]> = [
  ['Marry Shelly', 'Frankenstein'],
  ['Jules Verne', '20,000 Leagues Under the Sea'],
  ['Jules Verne', 'Around the World in 80 Days'],
  ['H.G. Wells', 'The Time Machine'],
];

const zip = <T>(arr1: (string | number | symbol)[], arr2: unknown[]): T => {
  const out: any = {};
  for (const [index, key] of arr1.entries()) {
    out[key] = arr2[index];
  }
  return out as T;
}

const setValue = <T>(key: keyof T, value: T[keyof T]) => (item: T): T => ({ ...item, [key]: value });
const createObj = <T>(keys: Array<keyof T>) => (values: unknown[]) => zip<T>(keys, values);
const filter = <T>(k: keyof T, val: unknown) => (item: Option<T>) => unwrap(item)[k] === val;


const createBook = createObj(booksKeys);
console.log(books.map(createBook));



interface Query {
  start?: number;
  size?: number;
}