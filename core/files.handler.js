const fs = require("fs");
const path = require("path");

const getTranslationsPaths = (customPreferences = {}) => {
  const definitions = {
    path: customPreferences.langsFolder ,
    mainFile: customPreferences.langFile || "translation.json",
    extraFiles: customPreferences.files || [],
  };
  console.log("definitions", definitions);

  console.log("langsFolder", definitions.path);
  const langsFolder = path.join(definitions.path);

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
              const mainTranslationFilePath = path.join(filePath, definitions.mainFile);

              fs.access(mainTranslationFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                  return reject(
                    new Error(
                      `Unable to read i18n4e translation file in ${mainTranslationFilePath}`
                    )
                  );
                } else {
                  returnValues[file] = mainTranslationFilePath;
                  return resolve();
                }
              });


              if (definitions.extraFiles.length) {
                definitions.extraFiles.forEach((extraFile) => {
                  const extraFilePath = path.join(filePath, extraFile);

                  fs.access(extraFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                      return reject(
                        new Error(
                          `Unable to read i18n4e extra file in ${extraFilePath}`
                        )
                      );
                    } else {
                      returnValues[file] = extraFilePath;
                      return resolve();
                    }
                  });
                });
              }



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
  getTranslationsPath: getTranslationsPaths,
};
