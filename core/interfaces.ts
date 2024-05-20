import express from 'express';

export interface TranslationsRouteValues {
  [key: string]: string[];
}

export interface options {
  defaultLang?: string;
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string;
  previousLocalsMiddleware?: boolean;
  path?: string;
}

export interface I18n4e {
  languages: object;
  defaultLang: string;
  path: string;
  init: (
    app: express.Application,
    options?: options,
    renderWithDocument?: boolean
  ) => Promise<any>;
}
