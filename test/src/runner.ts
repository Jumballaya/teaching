import { TestRunner } from "./TestRunner";

const tr = new TestRunner({
  path: './dist',
  extension: '.spec.js',
});

tr.runTests();