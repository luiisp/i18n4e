import { suportedLanguages } from '../../config/supportedLanguages.json';

export const folderNameIsALanguage = (folderName: string): boolean => {
  const isValid = suportedLanguages.find(
    (lang) => lang.code === folderName || lang.name === folderName
  );
  return isValid ? true : false;
};
