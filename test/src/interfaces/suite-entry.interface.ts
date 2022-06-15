type noop = () => void;

export interface SuiteEntry {
  name: string;
  body: noop;
  beforeEach: Array<noop>;
  afterEach: Array<noop>;
  beforeAll: Array<noop>;
  afterAll: Array<noop>;
  tests: Array<{ name: string; body: noop; message?: string; passed?: boolean; }>;
}