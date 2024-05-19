const fs = require("fs");
const path = require("path");

const getTranslationsPaths = (customPreferences = {}) => {
  const definitions = {
    path: customPreferences.langsFolder,
    mainFile: customPreferences.langFile || "translation.json",
    extraFiles: customPreferences.files || [],
  };

  console.log("definitions", definitions); 

  const langsFolder = path.join(definitions.path);
  console.log("langsFolder", langsFolder); 
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
              console.log("mainTranslationFilePath", mainTranslationFilePath); 

              fs.access(mainTranslationFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                  return reject(
                    new Error(
                      `The main json file defined as (${definitions.mainFile}) was not found. Expected Path: ${mainTranslationFilePath}`
                    )
                  );
                } else {
                  returnValues[file] = {
                    0: mainTranslationFilePath,
                  };
                }
              });

              if (definitions.extraFiles.length) {
                console.log("have extra files")
                let i = 0;
                definitions.extraFiles.forEach((extraFile) => {
                  const extraFilePath = path.join(filePath, extraFile);
                  console.log("extraFilePath", extraFilePath); 

                  fs.access(extraFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                      return reject(
                        new Error(
                          `The file (${extraFile}) was defined as extra but was not found. Expected Path: ${extraFilePath}`
                        )
                      );
                    } else {
                      console.log("found extra file")
                      i++;
                      returnValues[file][i] = extraFilePath;
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
