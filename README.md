# testable code refactor sample

This repo demo how to refactor code to more testable by simple case

## what is testable code?

1. less side effect

2. easy to test without couple to some environment/facility

## how to do?

1. separate main logic from side effect logic(e.g. file I/O, DB connection)

2. use abstraction on those side effect logic(this could be done by Dependency injection)

## Example Requirement

1. Take two filenames from command line

2. Read first file passed, compute number of words that show up more than once, and output that number to the second file

## First Fulfilled with Request original

```typescript
import * as fs from 'fs';

if (process.argv.length !== 4) {
  console.error('Wrong number of args')
  process.exit(1)
}
const inputfilename: string = process.argv[2];
const outputfilename: string = process.argv[3];

const inputData: string = fs.readFileSync(inputfilename, 'utf-8');
const lines: string[] = inputData.split('\n');
const words: string[] = lines.flatMap(l=>l.split(" ")).filter(w => w.length > 0);

const seenWords: Set<string> = new Set();
const repeatedWords: Set<string> = new Set();
words.forEach(w => {
  if (seenWords.has(w)) {
    repeatedWords.add(w);
  }
  seenWords.add(w);
});
fs.writeFileSync(outputfilename, repeatedWords.size.toString());
```