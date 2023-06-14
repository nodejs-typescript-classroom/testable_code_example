import { realFileSystemModule, FilesystemInterface } from './filesystem.interface';
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
    console.error('Wrong number of args', process.argv.length)
    process.exit(1)
  }
  const inputfilename: string = process.argv[2];
  const outputfilename: string = process.argv[3];
  run(realFileSystemModule, inputfilename, outputfilename)
}