const fs = require('fs');
const path = require('path');

const getTranslationsPath = (customPreferences = {}) => {
    const definitions = {
        path: customPreferences.langsFolder || '/langs',
        file: customPreferences.langFile || 'translation.json',
    }
    console.log('definitions', definitions);

    const langsFolder = path.join(__dirname, definitions.path);


    return new Promise((resolve, reject) => {
        fs.readdir(langsFolder, (err, files) => {
            if (err) {
                return reject(new Error(`Unable to read i18n4e folders in ${langsFolder}`));
            }

            const returnValues = {};
            const promises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(langsFolder, file);

                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            return reject(new Error(`Unable to read i18n4e folder in ${filePath}`));
                        }

                        if (stats.isDirectory()) {
                            const translationFilePath = path.join(filePath, definitions.file);

                            fs.access(translationFilePath, fs.constants.F_OK, (err) => {
                                if (err) {
                                    return reject(new Error(`Unable to read i18n4e translation file in ${translationFilePath}`));
                                } else {
                                    returnValues[file] = translationFilePath;
                                    return resolve();
                                }
                            });
                        } else {
                            return resolve();
                        }
                    });
                });
            });

            Promise.all(promises)
                .then(() => resolve(returnValues))
                .catch(err => reject(err));
        });
    });
};

const i18n4e = {
    languages: {},
    defaultLang: 'en',
    path: '/i18n4e/i/translations/',
    middleware: () => {
        return (req, res, next) => {
            res.locals.i18n4e = {
                languages: Object.keys(i18n4e.languages),
                defaultLang: i18n4e.defaultLang,
                path: i18n4e.path,
                languagesFiles: i18n4e.languages,
            };

            next();
        };
    },

    route: () => {
        return (req, res) => {
            let lang = req.query.lang;
            if (!lang) {
                return res.status(404).json({message: 'Not found'});
            }

            
            let translations = require(i18n4e.languages[lang]);

            
            if (!translations) {
                lang = i18n4e.defaultLang;
            }

            translations = require(i18n4e.languages[lang]);

            if (!lang || !translations) {
                return res.status(404).json({message: 'Not found'});
            }

            res.json(translations);


        };
    },

    init: (app, customPreferences = {
        defaultLang: undefined,
        langsFolder: undefined,
        mainFile: undefined,
        files: undefined,
        previousLocalsMiddleware: false,
        i18n4ePath: undefined,
    }) => {
        if (customPreferences.defaultLang) {
            i18n4e.defaultLang = customPreferences.defaultLang;
        }

        if (customPreferences.i18n4ePath) {
            i18n4e.path = customPreferences.i18n4ePath;
        }


        app.use(`${i18n4e.path}/`, i18n4e.route()); 

        if (!customPreferences.previousLocalsMiddleware) {
            app.use(i18n4e.middleware());
            return;
        }
        

        return getTranslationsPath(customPreferences)
            .then(returnValues => {
                i18n4e.languages = returnValues;
                console.log('i18n4e languages loaded', returnValues);
                return returnValues;
            })
            .catch(err => {
                console.error(err);
                return undefined;
            });
    }
};

module.exports = i18n4e;
