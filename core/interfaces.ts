import express from 'express';

export interface langsFilesPath {
  [key: string]: string[];
}

export interface options {
  defaultLang?: string;
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string[];
  path?: string;
  renderWithDocument?: boolean;
}


export interface optionsServerSide{
  optionsServerSide?: boolean; 
  useAllExtraFiles?: boolean;
  removeTagAfterTranslation?: boolean;
  extraFiles?: string[];

}

export interface I18n4e {
  langsFilesPath: langsFilesPath;
  defaultLang: string;
  path: string;
  init: (app: express.Application, options?: options) => Promise<any>;
}

export interface minFilesOptions {
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string[];
}
