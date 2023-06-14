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