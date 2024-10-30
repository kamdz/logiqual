import compare from '@@';

describe('Boolean Functions Comparison', () => {
  it('should return true for equal functions', () => {
    const result = compare(
      (x: boolean, y: boolean) => x && y,
      (x: boolean, y: boolean) => y && x
    );
    expect(result.isEqual).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  it('should return false for different functions', () => {
    const result = compare(
      (x: boolean, y: boolean) => x && y,
      (x: boolean, y: boolean) => x || y
    );
    expect(result.isEqual).toBe(false);
    expect(result.differences).toEqual([
      [
        { result: false, x: false, y: true },
        { result: true, x: false, y: true }
      ],
      [
        { result: false, x: true, y: false },
        { result: true, x: true, y: false }
      ]
    ]);
  });

  it('should throw an error if functions have different parameter counts', () => {
    expect(() =>
      compare(
        x => x,
        (x: boolean, y: boolean) => x && y
      )
    ).toThrow('Both functions must have the same number of parameters');
  });

  it('should throw an error if the first argument is not a function', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => compare(42 as any, (x: boolean, y: boolean) => x && y)).toThrow(
      'Argument funcA must be a function, received number'
    );
  });

  it('should throw an error if the second argument is not a function', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => compare((x: boolean, y: boolean) => x && y, 'string' as any)).toThrow(
      'Argument funcB must be a function, received string'
    );
  });
});
