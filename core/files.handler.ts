import * as fs from "fs";
import * as path from "path";

interface CustomPreferences {
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string[];
}

const getTranslationsPaths = (customPreferences: CustomPreferences = {}): Promise<{ [key: string]: string[] }> => {
  const regex = /\/|\\/g;
  const definitions = {
    path: customPreferences.langsFolder || "",
    mainFile: customPreferences.mainFile || "translation.json",
    extraFiles: customPreferences.extraFiles || [],
  };

  definitions.path = definitions.path.replace(regex, path.sep);

  const langsFolder = path.join(definitions.path);
  console.log("langsFolder", langsFolder);
  return new Promise((resolve, reject) => {
    fs.readdir(langsFolder, (err, files) => {
      if (err) {
        return reject(
          new Error(`i18n4e languages folder defined as (${definitions.path}) was not found.`)
        );
      }

      const returnValues: { [key: string]: string[] } = {};
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
                  returnValues[file] = [mainTranslationFilePath];
                  
                  if (definitions.extraFiles.length) {
                    console.log("have extra files");

                    const extraPromises = definitions.extraFiles.map((extraFile) => {
                      return new Promise((resolve, reject) => {
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
                            console.log("found extra file");
                            returnValues[file].push(extraFilePath); 
                            resolve(returnValues);
                          }
                        });
                      });
                    });

                    Promise.all(extraPromises)
                      .then(() => resolve(returnValues))
                      .catch(reject);
                  } else {
                    resolve(returnValues);
                  }
                }
              });
            } else {
              resolve(returnValues);
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

export { getTranslationsPaths };
