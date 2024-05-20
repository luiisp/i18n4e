import express from 'express';
export interface langsFilesPath {
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
    langsFilePath: langsFilesPath;
    defaultLang: string;
    path: string;
    init: (app: express.Application, options?: options, renderWithDocument?: boolean) => Promise<any>;
}
//# sourceMappingURL=interfaces.d.ts.map