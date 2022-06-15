import { Module } from '../../../di';
import { BooksController } from './Books.controller';
import { BooksService } from './Books.service';

@Module({
  controllers: [BooksController],
  services: [BooksService],
})
export class BooksModule { }