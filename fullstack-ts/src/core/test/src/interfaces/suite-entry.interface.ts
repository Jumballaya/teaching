type noop = () => void;
type pnoop = () => Promise<void>;

export interface SuiteEntry {
  name: string;
  body: noop | pnoop;
  beforeEach: Array<noop | pnoop>;
  afterEach: Array<noop | pnoop>;
  beforeAll: Array<noop | pnoop>;
  afterAll: Array<noop | pnoop>;
  tests: Array<{ name: string; body: noop | pnoop; message?: string; passed?: boolean; }>;
}