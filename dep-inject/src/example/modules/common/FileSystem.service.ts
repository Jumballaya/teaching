import * as fs from 'fs';
import { from, Observable } from 'rxjs';
import { promisify } from 'util';
import { Injectable } from '../../../di';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

@Injectable()
export class FileSystemService {

  public readFile(path: string): Observable<Buffer> {
    return from(readFile(path));
  }

  public writeFile(path: string, data: string | Buffer): Observable<void> {
    return from(writeFile(path, data));
  }
}