import path from 'path';
import { TestRunnerConfig } from "./interfaces/test-runner-config.interface";
import { getRecursiveFilelist } from './utils';
import { showTestResults } from './test';

const defaultConfig: TestRunnerConfig = {
  path: path.resolve(process.cwd(), 'src'),
  extension: '.spec.ts',
};

export class TestRunner {

  private tests: string[] = [];


  constructor(private cfg = defaultConfig) { }

  public async runTests() {
    await this.getTests();

    for await (const fp of this.tests) {
      await require(fp);
      console.log(fp);
    }
    console.log('\n');

    showTestResults();
  }

  private async getTests() {
    const tests = await getRecursiveFilelist(this.cfg.path, this.cfg.extension);
    this.tests = tests;
  }
}