# ⚖️ logiqual

A lightweight library for comparing boolean functions and generating truth tables. This tool allows you to validate the equality of logical expressions efficiently and effectively.

## 🚀 Features

- **Functions comparison** – determine if two boolean functions produce the same outputs for all possible inputs.
- **Truth table generation** – create detailed truth tables for any variadic boolean function.
- **Detailed mismatch reporting** – provides specific input combinations where functions differ.

## 🛠️ Installation

```bash
npm install logiqual
```

## 📖 Usage

### Comparing Functions

```javascript
import { compareFunctions } from 'logiqual';

const result = compareFunctions(
  (x, y) => x && y,
  (x, y) => x || y
);

console.log(result.isEqual); // false
console.log(result.differences); // Detailed differences
```

### Generating a Truth Table

```javascript
import { generateTruthTable } from 'logiqual';

const table = generateTruthTable((a, b) => a && b);
console.table(table);
```

### Command Line Interface (CLI)
You can also use it via the command line:

```bash
npx logiqual '(x, y) => x && y' '(x, y) => x || y'
# false
# [
#   [
#     { x: false, y: true, result: false },
#     { x: false, y: true, result: true }
#   ],
#   [
#     { x: true, y: false, result: false },
#     { x: true, y: false, result: true }
#   ]
# ]
```

## 🔧 API

### `compareFunctions(funcA: VariadicFunction, funcB: VariadicFunction): { isEqual: boolean; differences: Difference[] }`

Compares two boolean functions for equality based on their outputs for all possible input combinations.

- `funcA` (VariadicFunction): The first function to compare.
- `funcB` (VariadicFunction): The second function to compare.
- **Returns**: An object with:
  - `isEqual` (boolean): Whether the functions are equal.
  - `differences` (Difference[]): An array of mismatches found.

### `generateTruthTable(func: VariadicFunction): TruthTableEntry[]`

Generates a truth table for a given variadic boolean function.

- `func` (VariadicFunction): The function to generate the truth table for.
- **Returns**: An array of objects representing the truth table.
