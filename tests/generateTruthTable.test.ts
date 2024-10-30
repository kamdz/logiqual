import { generateTruthTable } from '@@';

describe('generateTruthTable', () => {
  it('should generate the correct truth table for function', () => {
    const table = generateTruthTable((a, b, c) => a || (b && c));
    expect(table).toEqual([
      { a: false, b: false, c: false, result: false },
      { a: false, b: false, c: true, result: false },
      { a: false, b: true, c: false, result: false },
      { a: false, b: true, c: true, result: true },
      { a: true, b: false, c: false, result: true },
      { a: true, b: false, c: true, result: true },
      { a: true, b: true, c: false, result: true },
      { a: true, b: true, c: true, result: true }
    ]);
  });
});
