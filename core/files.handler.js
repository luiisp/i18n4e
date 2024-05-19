const fs = require("fs");
const path = require("path");

const getTranslationsPath = (customPreferences = {}) => {
  const definitions = {
    path: customPreferences.langsFolder || "/langs",
    file: customPreferences.langFile || "translation.json",
  };
  console.log("definitions", definitions);

  const langsFolder = path.join(__dirname, definitions.path);

  return new Promise((resolve, reject) => {
    fs.readdir(langsFolder, (err, files) => {
      if (err) {
        return reject(
          new Error(`Unable to read i18n4e folders in ${langsFolder}`)
        );
      }

      const returnValues = {};
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(langsFolder, file);

          fs.stat(filePath, (err, stats) => {
            if (err) {
              return reject(
                new Error(`Unable to read i18n4e folder in ${filePath}`)
              );
            }

            if (stats.isDirectory()) {
              const translationFilePath = path.join(filePath, definitions.file);

              fs.access(translationFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                  return reject(
                    new Error(
                      `Unable to read i18n4e translation file in ${translationFilePath}`
                    )
                  );
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
        .catch((err) => reject(err));
    });
  });
};

module.exports = {
  getTranslationsPath,
};
