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