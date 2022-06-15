import path from 'path';
import { TestRunnerConfig } from "./interfaces/test-runner-config.interface";
import { getRecursiveFilelist, isDirectory } from './utils';
import { showTestResults } from './test';

const defaultConfig: TestRunnerConfig = {
  path: [path.resolve(process.cwd(), 'src')],
  extension: '.spec.ts',
};

export class TestRunner {

  private tests: string[] = [];


  constructor(private cfg = defaultConfig) { }

  public async runTests() {
    await this.getTests();

    for await (const fp of this.tests) {
      const fullPath = this.truncateTsJs(path.resolve(__dirname, '../../../../', fp));
      console.log(fullPath);
      await require(fullPath);
    }
    console.log('\n');

    showTestResults();
  }

  private async getTest(fp: string) {
    if (isDirectory('./')(fp)) {
      const tests = await getRecursiveFilelist(fp, this.cfg.extension);
      this.tests = [...this.tests, ...tests];
    } else {
      this.tests = [...this.tests, fp];
    }
  }

  private async getTests() {
    for await (const test of this.cfg.path) {
      await this.getTest(test);
    }
  }

  private truncateTsJs(fp: string): string {
    if (fp.endsWith('.js') || fp.endsWith('.ts')) {
      return fp.slice(0, fp.length - 3);
    }
    return fp;
  }
}