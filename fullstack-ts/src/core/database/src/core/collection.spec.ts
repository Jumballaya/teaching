import { describe, expect, it } from "../../../test";
import { Collection } from "./Collection";

describe('Collection', () => {

  it('Can be created', () => {
    const col = new Collection<any>('cols', 'col');
    expect(col).toExist();
  });

});