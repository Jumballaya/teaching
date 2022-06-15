import { TestingState } from './TestingState';

export class Matchers<T> {

  private inversed = false;

  constructor(
    private readonly actual: T,
    private state: TestingState,
  ) { }

  // Not sets the inversed flag
  public get not(): Matchers<T> {
    this.inversed = true;
    return this;
  }


  // Checks if expected value is triple-equal to the actual value
  toBe(expected: T) {
    const test = this.actual === expected;
    const notTest = this.actual !== expected;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Actual: ${this.actual}, Expected: ${expected}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if the expected value is deep-equal to value
  toEqual(expected: T) {
    const expectedString = JSON.stringify(expected, null, 2);
    const actualString = JSON.stringify(this.actual, null, 2);
    const test = expectedString === actualString;
    const notTest = expectedString !== actualString;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Actual: ${actualString}, Expected: ${expectedString}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }


  // Checks if actual value is truthy
  toBeTruthy() {
    const test = this.actual;
    const notTest = !this.actual;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Expected value to be truthy but got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if actual value is falsy
  toBeFalsy() {
    const test = !this.actual;
    const notTest = this.actual;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Expected value to be falsey but got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if actual is a non null/undefined value
  toExist() {
    const notNull = this.actual === null;
    const notUndefined = this.actual === undefined;
    const test = notNull && notUndefined;
    const notTest = this.actual === null || this.actual === undefined;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Expected value to exists, got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if actual is Null
  toBeNull() {
    const test = this.actual === null;
    const notTest = this.actual !== null;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `X Fail - Expected value to be null, got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if actual is undefined
  toBeUndefined() {
    const test = this.actual === undefined;
    const notTest = this.actual !== undefined;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Expected value to be undefined, got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks if actual is not undefined
  toBeDefined() {
    const test = this.actual !== undefined;
    const notTest = this.actual === undefined;
    if (this.inversed ? notTest : test) {
      this.state.incPassed();
    } else {
      const msg = `Fail - Expected value to be defined, got ${this.actual}`;
      this.state.incFailed();
      throw new Error(msg);
    }
  }

  // Checks to see if the value throws an error
  toThrow(error?: any) {

    try {
      if (this.actual instanceof Function) {
        this.actual();
        if (this.inversed) {
          this.state.incPassed();
          return;
        }
      }
    } catch (err: any) {
      if (!this.inversed) {
        if (error ? err.constructor === error : true) {
          this.state.incPassed();
          return;
        }
        const msg = `Fail - Expected value to throw type ${error.name}, got ${err.name}`;
        this.state.incFailed();
        throw new Error(msg);
      }
      const msg = `Fail - Expected value to not throw an Error`;
      this.state.incFailed();
      throw new Error(msg);
    }
    const msg = `Fail - Expected value to throw an Error`;
    this.state.incFailed();
    throw new Error(msg);
  }

}