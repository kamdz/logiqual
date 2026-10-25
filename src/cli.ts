#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { compare, generateTruthTable, type VariadicFunction } from './index.ts';

const HELP = `Usage:
  logiqual <function>               print the truth table of a function
  logiqual <function> <function>    compare two functions

Examples:
  logiqual '(a, b) => a && b'
  logiqual '(x, y) => !(x && y)' '(x, y) => !x || !y'

Options:
  -h, --help  show this help`;

const parseFunction = (source: string): VariadicFunction => new Function(`return (${source});`)();

function main(): void {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { help: { type: 'boolean', short: 'h' } }
  });

  if (values.help || positionals.length === 0) {
    console.log(HELP);
    return;
  }
  if (positionals.length > 2) throw new RangeError(`unexpected argument: ${positionals[2]}`);

  const [funcA, funcB] = positionals.map(parseFunction);

  if (funcB === undefined) {
    console.table(generateTruthTable(funcA as VariadicFunction));
    return;
  }

  const { isEqual, differences } = compare(funcA as VariadicFunction, funcB);
  console.log(isEqual);
  if (!isEqual) console.dir(differences, { depth: null });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
