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
                return reject(new Error(`Unable to read i18n4ejs folders in ${langsFolder}`));
            }

            const returnValues = {};
            const promises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(langsFolder, file);

                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            return reject(new Error(`Unable to read i18n4ejs folder in ${filePath}`));
                        }

                        if (stats.isDirectory()) {
                            const translationFilePath = path.join(filePath, definitions.file);

                            fs.access(translationFilePath, fs.constants.F_OK, (err) => {
                                if (err) {
                                    return reject(new Error(`Unable to read i18n4ejs translation file in ${translationFilePath}`));
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

const i18n4ejs = {
    languages: {},
    defaultLang: 'en',
    path: '/i18n4ejs',
    middleware: () => {
        return (req, res, next) => {
            res.locals.i18n4ejs = {
                languages: Object.keys(i18n4ejs.languages),
                defaultLang: i18n4ejs.defaultLang,
                path: i18n4ejs.path,
            };

            next();
        };
    },

    route: () => {
        return (req, res) => {
            let lang = req.query.lang;
            console.log('lang', lang);
            console.log('i18n4ejs.languages', i18n4ejs.languages);
            console.log('i18n4ejs.languages[lang]', i18n4ejs.languages[lang]);
            if (!lang) {
                return res.status(404).json({message: 'Not found'});
            }

            
            let translations = require(i18n4ejs.languages[lang]);

            
            if (!translations) {
                lang = i18n4ejs.defaultLang;
            }

            translations = require(i18n4ejs.languages[lang]);

            if (!lang || !translations) {
                return res.status(404).json({message: 'Not found'});
            }

            res.json(translations);


        };
    },

    config: (app, customPreferences = {
        defaultLang: undefined,
        langsFolder: undefined,
        langFile: undefined,
        i18n4ejsPath: undefined,
    }) => {
        if (customPreferences.defaultLang) {
            i18n4ejs.defaultLang = customPreferences.defaultLang;
        }

        if (customPreferences.i18n4ejsPath) {
            i18n4ejs.path = customPreferences.i18n4ejsPath;
        }


       // app.use(`${i18n4ejs.path}/:lang`, i18n4ejs.route()); 
        app.use(i18n4ejs.middleware());

        return getTranslationsPath(customPreferences)
            .then(returnValues => {
                i18n4ejs.languages = returnValues;
                console.log('i18n4ejs languages loaded', returnValues);
                return returnValues;
            })
            .catch(err => {
                console.error(err);
                return undefined;
            });
    }
};

module.exports = i18n4ejs;
