#!/usr/bin/env node
import compare, { generateTruthTable } from '@@';

try {
  if (process.argv.length === 3) {
    const func = new Function(`return ${process.argv[2]}`)();
    console.table(generateTruthTable(func));
  } else if (process.argv.length === 4) {
    const funcA = new Function(`return ${process.argv[2]}`)();
    const funcB = new Function(`return ${process.argv[3]}`)();
    const result = compare(funcA, funcB);
    console.log(result.isEqual);
    console.log(result.differences);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
