import { SuiteEntry } from './interfaces/suite-entry.interface';
import { Color } from './Color';


type noop = () => void;


export class TestingState {

  private suiteList: Array<string> = [];

  private suites: Map<string, SuiteEntry> = new Map();

  private totalSuites = 0;
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;

  private inSuite = false;

  constructor() { }

  public incPassed() {
    this.passedTests++;
  }

  public incFailed() {
    this.failedTests++;
  }

  public addSuite(name: string, body: noop) {
    this.totalSuites++;
    this.suites.set(name, {
      name,
      body,
      beforeAll: [],
      beforeEach: [],
      afterAll: [],
      afterEach: [],
      tests: [],
    });
  }

  public addTest(name: string, body: noop) {
    this.totalTests++;
    const suite = this.getCurrentSuite();
    if (suite) {
      suite.tests.push({ name, body });
      this.suites.set(suite.name, suite);
    }
  }

  public addBeforeEach(body: noop) {
    const suite = this.getCurrentSuite();
    if (suite) {
      suite.beforeEach.push(body);
      this.suites.set(suite.name, suite);
    }
  }

  public getBeforeEach(): Array<noop> {
    return [];
  }

  public addAfterEach(body: noop) {
    const suite = this.getCurrentSuite();
    if (suite) {
      suite.afterEach.push(body);
      this.suites.set(suite.name, suite);
    }
  }

  public addBeforeAll(body: noop) {
    const suite = this.getCurrentSuite();
    if (suite) {
      suite.beforeAll.push(body);
      this.suites.set(suite.name, suite);
    }
  }

  public addAfterAll(body: noop) {
    const suite = this.getCurrentSuite();
    if (suite) {
      suite.afterAll.push(body);
      this.suites.set(suite.name, suite);
    }
  }

  public runSuites() {
    for (const [name, suite] of this.suites) {
      this.enterSuite(name);
      suite.body();

      // Before All
      for (const ba of suite.beforeAll) ba();

      // Each Test
      for (const test of suite.tests) {

        // Before Each
        for (const be of suite.beforeEach) be();

        // Run Test
        try {
          test.body();
          test.message = '√ Succeeded';
          test.passed = true;
        } catch (e: any) {
          test.message = `X Failed\n    ${e}`;
          test.passed = false;
        }

        // After Each
        for (const ae of suite.afterEach) ae();
      }

      // After All
      for (const aa of suite.afterAll) aa();

      this.leaveSuite();
    }
  }

  public printResults() {
    for (const [name, suite] of this.suites) {
      console.log(Color.cyan(`Suite: ${name}`));
      console.log(Color.yellow(`Total Tests: ${suite.tests.length}`));
      console.log('\n');

      for (const test of suite.tests) {
        console.log(Color.yellow(`  Test: ${test.name}`));
        if (test.passed) {
          console.log(Color.green(`  ${test.message}\n\n`));
        } else {
          console.log(Color.red(`  ${test.message}\n\n`));
        }
      }
      console.log(Color.reset(), '\n');
    }

    console.log(Color.black('------------------------\n'));
    console.log(Color.yellow(`Total Test Suites: ${this.totalSuites}`));
    console.log(Color.yellow(`Total Tests: ${this.totalTests}`));
    console.log(Color.green(`Passed Tests: ${this.passedTests}`));
    console.log(Color.red(`Failed Tests: ${this.failedTests}`));
    console.log(Color.reset(), '\n');
  }

  private enterSuite(name: string) {
    this.inSuite = true;
    this.suiteList.push(name);
  }

  private leaveSuite() {
    this.inSuite = false;
    this.suiteList.shift();
  }

  private getCurrentSuite(): SuiteEntry | undefined {
    const name = this.suiteList[0];
    const suite = this.suites.get(name)
    return suite;
  }
}