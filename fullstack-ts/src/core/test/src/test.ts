import { TestingState } from './TestingState';
import { Matchers } from "./Matchers";

export const state = new TestingState();

export function beforeEach(body: () => void) {
  state.addBeforeEach(body);
}

export function afterEach(body: () => void) {
  state.addAfterEach(body);
}

export function beforeAll(body: () => void) {
  state.addBeforeAll(body);
}

export function afterAll(body: () => void) {
  state.addAfterAll(body);
}

export function expect<T>(actual: T) {
  return new Matchers(actual, state);
}

export function it(name: string, body: () => void) {
  state.addTest(name, body);
}

export function describe(name: string, body: () => void) {
  state.addSuite(name, body);
}

export async function showTestResults() {
  await state.runSuites();
  state.printResults();
}