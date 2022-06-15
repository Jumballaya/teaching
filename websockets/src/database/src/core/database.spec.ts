import { describe, expect, it } from "../../../test";
import { Database } from "./Database";

describe('Database', () => {

  it('Can be created', () => {
    const db = new Database('./.data');
    expect(db).toExist();
  });

});