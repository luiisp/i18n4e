import { suportedLanguages } from '../../config/supportedLanguages.json';
import fs from 'fs';
import * as path from 'path';



export const folderNameIsALanguage = (folderName: string): boolean => {
	const isValid = suportedLanguages.find(
		(lang) => lang.code === folderName || lang.name === folderName
	);
	return isValid ? true : false;
};




export const scourFolder = (nameFolder: string): string | undefined => {
  let foundedI18n4e = false;
  let actualDir = path.dirname(__filename);

  while (!foundedI18n4e) {
    const files = fs.readdirSync(actualDir);
    if (!files || files.length === 0 || nameFolder === undefined) {
      return undefined;
    }

    if (files.includes('node_modules') || files.includes('package.json')) {
      const result = findFolderRecursive(actualDir, nameFolder);
      return result;
    } else {
      actualDir = path.join(actualDir, '..');
    }
  }

  return undefined;
}

const findFolderRecursive = (dir: string, folderName: string): string | undefined => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === folderName) {
        return fullPath;
      }

      const result = findFolderRecursive(fullPath, folderName);
      if (result) {
        return result;
      }
    }
  }

  return undefined;
}