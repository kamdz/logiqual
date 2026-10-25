# ⚖️ logiqual

A lightweight library for comparing boolean functions and generating truth tables. Check whether two logical expressions are equivalent and see exactly where they differ.

## 🚀 Features

- **Function comparison** – check whether two boolean functions return the same value for every input.
- **Truth tables** – generate the full truth table of any boolean function.
- **Detailed mismatches** – every input on which the functions differ, labelled with each function's own parameter names.
- **CLI** – compare expressions or print truth tables straight from the terminal.

## 🛠️ Installation

```bash
npm install logiqual
```

Requires Node.js 22.12 or later. The package is ESM-only; `require('logiqual')` also works on supported Node versions.

## 📖 Usage

### Comparing functions

```js
import { compare } from 'logiqual';

const { isEqual, differences } = compare(
  (x, y) => x && y,
  (x, y) => x || y
);

console.log(isEqual); // false
console.log(differences);
// [
//   [ { x: false, y: true, result: false }, { x: false, y: true, result: true } ],
//   [ { x: true, y: false, result: false }, { x: true, y: false, result: true } ]
// ]
```

`compareFunctions` and the default export are aliases of `compare`.

### Generating a truth table

```js
import { generateTruthTable } from 'logiqual';

console.table(generateTruthTable((a, b) => a && b));
```

### Command line

```bash
npx logiqual '(x, y) => !(x && y)' '(x, y) => !x || !y'
# true

npx logiqual '(x, y) => x && y' '(x, y) => x || y'
# false
# [ [ { x: false, y: true, result: false }, { x: false, y: true, result: true } ], ... ]

npx logiqual '(a, b) => a && b'
# prints the truth table
```

The arguments are evaluated as JavaScript, so only pass expressions you trust.

## 🔧 API

### `compare(funcA, funcB): ComparisonResult`

Evaluates both functions for every combination of inputs.

- **Returns** `{ isEqual: boolean; differences: Difference[] }`, where each difference is `[rowOfA, rowOfB]` for one input.
- **Throws** `TypeError` when an argument is not a function and `RangeError` when the functions take a different number of parameters.

### `generateTruthTable(func): TruthTableEntry[]`

Returns one row per combination of inputs: every parameter by name plus `result`.

Parameter names are read from the function's source (`x => …`, `(x, y) => …`, `function (x, y) {…}`). When they can't be read, for example with rest parameters, the rows use `arg0`, `arg1`, …. Results are coerced to booleans.

## 🧑‍💻 Development

```bash
npm install
npm test           # node:test, runs the TypeScript sources directly
npm run lint       # Biome (lint + format check), npm run lint:fix to fix
npm run typecheck
npm run build      # tsc → dist/
```

Releases are automated with [release-please](https://github.com/googleapis/release-please) from [Conventional Commits](https://www.conventionalcommits.org/) and published to npm with trusted publishing.
