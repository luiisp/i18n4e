"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainTranslationsRoute = void 0;
const createMainTranslationsRoute = (app, values, path, defaultLang) => {
    console.log('createMainTranslationsRoute', values);
    console.log('createMainTranslationsRoute', path);
    console.log('createMainTranslationsRoute', defaultLang);
    app.get(`${path}/`, (req, res) => {
        let requestedFiles;
        let lang = req.query.lang || defaultLang;
        let requestedFilesQuery = req.query
            .extrafiles;
        if (requestedFilesQuery) {
            requestedFiles = requestedFilesQuery.split('/');
        }
        let translationsFilesListPath = values[lang];
        if (!requestedFilesQuery) {
            requestedFiles = [translationsFilesListPath[0]];
        }
        return res.status(404).json({ message: 'Not found' });
    });
};
exports.createMainTranslationsRoute = createMainTranslationsRoute;
