import { bongodb, injector } from "../../../core";

interface Album {
  title: string;
  artist: string;
}

@injector.Injectable()
export class AlbumsService {

  constructor(
    @injector.Inject('DATABASE_CONNECTION')
    private connection: bongodb.BongoDBClient,
  ) { }

  public async getAlbums() {
    const albumCol = await this.connection.getCollection<Album>('albums', 'Album');
    return await albumCol.read<Album>({});
  }

  public async getAlbum(id: string) {
    const albumCol = await this.connection.getCollection<Album>('albums', 'Album');
    return await albumCol.read<Album>({ _id: id });
  }

}