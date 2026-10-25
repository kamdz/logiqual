import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import compare, { compareFunctions, generateTruthTable, type VariadicFunction } from '../src/index.ts';

describe('compare', () => {
  it('is also exported as compareFunctions', () => {
    assert.equal(compare, compareFunctions);
  });

  it('detects equal functions', () => {
    const result = compare(
      (x: boolean, y: boolean) => !(x && y),
      (x: boolean, y: boolean) => !x || !y
    );
    assert.deepEqual(result, { isEqual: true, differences: [] });
  });

  it('reports every input where the functions differ', () => {
    const result = compare(
      (x: boolean, y: boolean) => x && y,
      (a: boolean, b: boolean) => a || b
    );
    assert.equal(result.isEqual, false);
    assert.deepEqual(result.differences, [
      [
        { x: false, y: true, result: false },
        { a: false, b: true, result: true }
      ],
      [
        { x: true, y: false, result: false },
        { a: true, b: false, result: true }
      ]
    ]);
  });

  it('compares functions without parameters', () => {
    const result = compare(
      () => true,
      () => false
    );
    assert.deepEqual(result.differences, [[{ result: true }, { result: false }]]);
  });

  it('throws for different parameter counts', () => {
    assert.throws(
      () =>
        compare(
          (x: boolean) => x,
          (x: boolean, y: boolean) => x && y
        ),
      { name: 'RangeError', message: 'Both functions must have the same number of parameters' }
    );
  });

  it('throws when an argument is not a function', () => {
    const fn = (x: boolean) => x;
    assert.throws(() => compare(42 as unknown as VariadicFunction, fn), {
      name: 'TypeError',
      message: 'Argument funcA must be a function, received number'
    });
    assert.throws(() => compare(fn, 'string' as unknown as VariadicFunction), {
      name: 'TypeError',
      message: 'Argument funcB must be a function, received string'
    });
  });
});

describe('generateTruthTable', () => {
  it('generates the truth table', () => {
    assert.deepEqual(
      generateTruthTable((a, b, c) => a || (b && c)),
      [
        { a: false, b: false, c: false, result: false },
        { a: false, b: false, c: true, result: false },
        { a: false, b: true, c: false, result: false },
        { a: false, b: true, c: true, result: true },
        { a: true, b: false, c: false, result: true },
        { a: true, b: false, c: true, result: true },
        { a: true, b: true, c: false, result: true },
        { a: true, b: true, c: true, result: true }
      ]
    );
  });

  it('reads parameter names from any function syntax', () => {
    const keys = (func: VariadicFunction) => Object.keys(generateTruthTable(func)[0] ?? {});

    assert.deepEqual(keys(x => !x), ['x', 'result']);
    assert.deepEqual(keys(x => x && !x), ['x', 'result']);
    assert.deepEqual(
      keys(function named(p, q) {
        return p !== q;
      }),
      ['p', 'q', 'result']
    );
    assert.deepEqual(keys((/* first */ a, b /* second */) => a && b), ['a', 'b', 'result']);
  });

  it('falls back to generic names when parameters cannot be read', () => {
    const rest = (...args: boolean[]) => args[0] === true;
    Object.defineProperty(rest, 'length', { value: 1 });
    assert.deepEqual(generateTruthTable(rest), [
      { arg0: false, result: false },
      { arg0: true, result: true }
    ]);
  });

  it('coerces results to booleans', () => {
    assert.deepEqual(generateTruthTable((() => 1) as unknown as VariadicFunction), [{ result: true }]);
  });
});

describe('cli', () => {
  const cli = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
  const run = (...args: string[]) => execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

  it('compares two functions', () => {
    assert.equal(run('(x, y) => !(x && y)', '(x, y) => !x || !y'), 'true\n');
    assert.match(run('(x, y) => x && y', '(x, y) => x || y'), /^false\n\[/);
  });

  it('prints a truth table', () => {
    assert.match(run('a => !a'), /result/);
  });

  it('fails on invalid input', () => {
    assert.throws(
      () => execFileSync(process.execPath, [cli, 'x => x', '(x, y) => x'], { stdio: 'pipe' }),
      /same number/
    );
  });
});
