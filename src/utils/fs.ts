import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const FS = {
  readFile: async (path: string) => {
    try {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return result.data;
    } catch (e) {
      console.error('Read error:', e);
      return '';
    }
  },

  writeFile: async (path: string, content: string) => {
    try {
      await Filesystem.writeFile({
        path,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (e) {
      console.error('Write error:', e);
      return false;
    }
  },

  listFiles: async (path: string = '') => {
    try {
      const result = await Filesystem.readdir({
        path,
        directory: Directory.Documents,
      });
      return result.files;
    } catch (e) {
      console.error('List error:', e);
      return [];
    }
  },

  createDirectory: async (path: string) => {
    try {
      await Filesystem.mkdir({
        path,
        directory: Directory.Documents,
        recursive: true,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
