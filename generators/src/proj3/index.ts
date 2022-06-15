import { calculate } from "./calculator";
import { parser } from "./parser";


const input = '* 3 (+ 1 2)';
const nodes = parser(input);
const ast = nodes[0];
console.log(calculate(ast));