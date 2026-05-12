import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const FS = {
  baseDir: Directory.Documents,

  listFiles: async (path: string = '') => {
    try {
      const result = await Filesystem.readdir({ path, directory: FS.baseDir });
      return result.files.map(f => ({
        ...f,
        uri: f.uri || `\( {path}/ \){f.name}`
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  readFile: async (path: string) => {
    try {
      const result = await Filesystem.readFile({
        path,
        directory: FS.baseDir,
        encoding: Encoding.UTF8,
      });
      return result.data;
    } catch (e) {
      console.error(e);
      return '';
    }
  },

  writeFile: async (path: string, content: string) => {
    try {
      await Filesystem.writeFile({
        path,
        data: content,
        directory: FS.baseDir,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  createFile: async (name: string, content: string = '') => {
    return FS.writeFile(name, content);
  },

  createFolder: async (name: string) => {
    try {
      await Filesystem.mkdir({ path: name, directory: FS.baseDir, recursive: true });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
