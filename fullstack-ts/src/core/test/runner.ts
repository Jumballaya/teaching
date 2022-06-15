import path from 'path';
import { parseArgv } from './src/utils';
import { TestRunner } from "./src/TestRunner";

const processed = parseArgv(process.argv);
const cmdPath = processed.commands.path || [];
const argsPath = [...cmdPath, ...processed.args];
const fp = argsPath.length > 0 ? argsPath : [path.resolve(process.cwd(), 'dist')];
const extension = processed.commands.ext?.length ? processed.commands.ext[0] : '.spec.js';
const tr = new TestRunner({ path: fp, extension });
tr.runTests();