import { getBinaryPermutations } from 'bin-perm-gen';

/** A boolean function of any number of boolean parameters. */
export type VariadicFunction = (...args: boolean[]) => boolean;

/** One row of a truth table: every parameter by name, plus the function's `result`. */
export type TruthTableEntry = Record<string, boolean>;

/** The same input evaluated by both functions: `[rowOfA, rowOfB]`. */
export type Difference = [TruthTableEntry, TruthTableEntry];

export interface ComparisonResult {
  /** `true` when both functions return the same value for every input. */
  isEqual: boolean;
  /** Every input for which the functions disagree. */
  differences: Difference[];
}

const assertFunction: (value: unknown, name: string) => asserts value is VariadicFunction = (value, name) => {
  if (typeof value !== 'function') {
    throw new TypeError(`Argument ${name} must be a function, received ${typeof value}`);
  }
};

/**
 * Reads parameter names from the function's source. Handles `x => …`, `(x, y) => …`, `function (x, y) {…}`,
 * comments and default values. Falls back to `arg0`, `arg1`, … when the names can't be read.
 */
function getParameterNames(func: VariadicFunction): string[] {
  const source = Function.prototype.toString.call(func).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const params =
    source.match(/^\s*(?:async\s+)?([\w$]+)\s*=>/)?.[1] ?? source.match(/^[^(]*\(([^)]*)\)/)?.[1] ?? '';

  const names = params
    .split(',')
    .map(param => param.split('=')[0]?.trim() ?? '')
    .filter(Boolean);

  return names.length >= func.length && names.slice(0, func.length).every(name => /^[\w$]+$/.test(name))
    ? names.slice(0, func.length)
    : Array.from({ length: func.length }, (_, i) => `arg${i}`);
}

const toEntry = (names: string[], inputs: boolean[], result: boolean): TruthTableEntry => ({
  ...Object.fromEntries(names.map((name, i) => [name, inputs[i] === true])),
  result
});

/**
 * Compares two boolean functions by evaluating both for every combination of inputs.
 *
 * @throws {TypeError} When either argument is not a function.
 * @throws {RangeError} When the functions take a different number of parameters.
 *
 * @example
 * const { isEqual, differences } = compare(
 *   (x, y) => !(x && y),
 *   (x, y) => !x || !y
 * );
 * console.log(isEqual); // true
 */
export function compare(funcA: VariadicFunction, funcB: VariadicFunction): ComparisonResult {
  assertFunction(funcA, 'funcA');
  assertFunction(funcB, 'funcB');

  if (funcA.length !== funcB.length) {
    throw new RangeError('Both functions must have the same number of parameters');
  }

  const namesA = getParameterNames(funcA);
  const namesB = getParameterNames(funcB);
  const differences: Difference[] = [];

  for (const inputs of getBinaryPermutations(funcA.length)) {
    const resultA = Boolean(funcA(...inputs));
    const resultB = Boolean(funcB(...inputs));

    if (resultA !== resultB) {
      differences.push([toEntry(namesA, inputs, resultA), toEntry(namesB, inputs, resultB)]);
    }
  }

  return { isEqual: differences.length === 0, differences };
}

/**
 * Generates the truth table of a boolean function, one row per combination of inputs.
 *
 * @throws {TypeError} When the argument is not a function.
 *
 * @example
 * console.table(generateTruthTable((a, b) => a && b));
 */
export function generateTruthTable(func: VariadicFunction): TruthTableEntry[] {
  assertFunction(func, 'func');

  const names = getParameterNames(func);
  return Array.from(getBinaryPermutations(func.length), inputs => toEntry(names, inputs, Boolean(func(...inputs))));
}

export { compare as compareFunctions };
export default compare;
