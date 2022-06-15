
export class FileHeader {

  private mapBuffer: Buffer;
  private fullBuffer: Buffer;

  constructor(private map: Record<string, string>) {
    const mapString = this.createMapString(this.map);
    this.mapBuffer = Buffer.from(mapString, 'binary');
    const tmp = Buffer.from(`${this.mapBuffer.byteLength}\n${mapString}`)
    const data = `${tmp.byteLength}\n${mapString}`;
    this.fullBuffer = Buffer.from(data, 'binary');
  }

  public getBuffer(): Buffer {
    return this.fullBuffer;
  }

  public getSize(): number {
    return this.fullBuffer.byteLength;
  }

  private createMapString(map: Record<string, string>): string {
    let str = '';
    for (const k in map) {
      str += `${k}:${map[k]}\n`
    }
    return str;
  }
}