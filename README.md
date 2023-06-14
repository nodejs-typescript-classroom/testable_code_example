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

## Step1 seperate core logic without side effect

```typescript
import * as fs from 'fs';

export const countRepeatedWords = (inputData: string): number => {
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
  return repeatedWords.size;
}
if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Wrong number of args')
    process.exit(1)
  }
  const inputfilename: string = process.argv[2];
  const outputfilename: string = process.argv[3];
  const inputData: string = fs.readFileSync(inputfilename, 'utf-8');
  fs.writeFileSync(outputfilename, countRepeatedWords(inputData).toString());
}
```

## add test

```typescript
import { countRepeatedWords } from './index';

describe('countRepeatedWords', () => {
  it('should return the correct result', () => {
    expect(countRepeatedWords('')).toBe(0)
    expect(countRepeatedWords('a a')).toBe(1)
    expect(countRepeatedWords('a b')).toBe(0)
    expect(countRepeatedWords('hello bye hello bye')).toBe(2)
    expect(countRepeatedWords('hello bye hello bye test')).toBe(2)
  })
})
```
## abstract side effect logic into interface

```typescript
import * as fs from 'fs';
export interface FilesystemInterface {
  readFile(filename: string): string;
  writeFile(filename: string, content: string): void;
}

export const realFileSystemModule: FilesystemInterface = {
  readFile: function (filename: string): string {
    return fs.readFileSync(filename, 'utf-8');
  },
  writeFile: function (filename: string, content: string): void {
    fs.writeFileSync(filename, content);
  }
}
export const countRepeatedWords = (inputData: string): number => {
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
  return repeatedWords.size;
}
export const run = (filesystem: FilesystemInterface, inputfilename: string, outputfilename: string) => {
  const inputData: string = filesystem.readFile(inputfilename);
  filesystem.writeFile(outputfilename, countRepeatedWords(inputData).toString()); 
}
if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Wrong number of args')
    process.exit(1)
  }
  const inputfilename: string = process.argv[2];
  const outputfilename: string = process.argv[3];
  run(realFileSystemModule, inputfilename, outputfilename)
}
```

## add test for run

```typescript
import { FilesystemInterface } from './filesystem.interface';
import { run, countRepeatedWords } from './index';

describe('countRepeatedWords', () => {
  it('should return the correct result', () => {
    expect(countRepeatedWords('')).toBe(0)
    expect(countRepeatedWords('a a')).toBe(1)
    expect(countRepeatedWords('a b')).toBe(0)
    expect(countRepeatedWords('hello bye hello bye')).toBe(2)
    expect(countRepeatedWords('hello bye hello bye test')).toBe(2)
  });
})
describe('app', () => {
  it('should make the proper read and write calls', () => {
    let readFileCallCount = 0, writteFileCallCount = 0;
    const fakeFilesystemModule: FilesystemInterface = {
      readFile(filename) {
        readFileCallCount++;
        expect(filename).toBe('myinputfilename')
        return 'contents here here';
      },
      writeFile(filename: string, content: string) {
        writteFileCallCount++;
        expect(filename).toBe('myoutputfilename')
        expect(content).toBe('1')
      }
    }
    run(
      fakeFilesystemModule,
      'myinputfilename',
      'myoutputfilename'
    );
    expect(readFileCallCount).toBe(1)
    expect(writteFileCallCount).toBe(1)
  });
})
```