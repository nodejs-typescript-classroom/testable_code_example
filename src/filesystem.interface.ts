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