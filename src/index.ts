import getBinaryPermutations from 'bin-perm-gen';

type VariadicFunction = (...args: boolean[]) => boolean;
type TruthTableEntry = Record<string, boolean>;
type Difference = [TruthTableEntry, TruthTableEntry];

function getParameterNames(func: VariadicFunction): string[] {
  const paramsString = func.toString().match(/\(([^)]*)\)/)?.[1] || '';
  return paramsString
    .split(',')
    .map(param => param.trim())
    .filter(Boolean);
}

/**
 * Compares two boolean functions for equality based on their outputs for all possible input combinations.
 *
 * @param funcA - The first function to compare.
 * @param funcB - The second function to compare.
 * @returns An object indicating whether the functions are equal, and any differences found.
 * @throws Will throw an error if the two functions do not have the same number of parameters or if either argument is not a function.
 *
 * @example
 * const result = compare(
 *   (x, y) => x && y,
 *   (x, y) => x || y
 * );
 * console.log(result.isEqual); // true or false
 * console.log(result.differences); // Detailed differences if any
 */
function compare(funcA: VariadicFunction, funcB: VariadicFunction): { isEqual: boolean; differences: Difference[] } {
  if (typeof funcA !== 'function') {
    throw new Error('Argument funcA must be a function, received ' + typeof funcA);
  }
  if (typeof funcB !== 'function') {
    throw new Error('Argument funcB must be a function, received ' + typeof funcB);
  }

  if (funcA.length !== funcB.length) {
    throw new Error('Both functions must have the same number of parameters');
  }

  const paramNamesA = getParameterNames(funcA);
  const paramNamesB = getParameterNames(funcB);

  const differences: Difference[] = [];

  const permutations = getBinaryPermutations(funcA.length);
  for (const permutation of permutations) {
    const resultA = funcA(...permutation);
    const resultB = funcB(...permutation);

    const paramsA = Object.fromEntries(paramNamesA.map((param, i) => [param, permutation[i]]));
    const paramsB = Object.fromEntries(paramNamesB.map((param, i) => [param, permutation[i]]));

    if (resultA !== resultB) {
      differences.push([
        { ...paramsA, result: resultA },
        { ...paramsB, result: resultB }
      ]);
    }
  }

  return {
    isEqual: differences.length === 0,
    differences
  };
}

/**
 * Generates a truth table for a given variadic boolean function.
 *
 * @param func - The function to generate the truth table for.
 * @returns An array of objects representing the truth table.
 * @example
 * const table = generateTruthTable((a, b) => a && b);
 * console.table(table);
 */
function generateTruthTable(func: VariadicFunction): TruthTableEntry[] {
  const permutations = getBinaryPermutations(func.length);
  const paramNames = getParameterNames(func);

  const truthTable: TruthTableEntry[] = [];
  for (const permutation of permutations) {
    const result = func(...permutation);
    const params = Object.fromEntries(paramNames.map((param, i) => [param, permutation[i]]));
    truthTable.push({ ...params, result });
  }
  return truthTable;
}

export default compare;
export { compare as compareFunctions, generateTruthTable };
