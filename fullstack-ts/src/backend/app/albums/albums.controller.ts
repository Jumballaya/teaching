import { webframework } from "../../../core";
import { AlbumsService } from "./albums.service";

@webframework.Controller('/albums')
export class AlbumsController {

  constructor(private $albums: AlbumsService) { }

  @webframework.Get('/')
  public getBooks() {
    return this.$albums.getAlbums();
  }

  @webframework.Get('/:id')
  public getBook(@webframework.Param('id') id: string) {
    return this.$albums.getAlbum(id);
  }
}