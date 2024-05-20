
const createMainTranslationsRoute = (app,values,path,defaultLang) => {
    console.log("createMainTranslationsRoute", values);
    console.log("createMainTranslationsRoute", path);
    console.log("createMainTranslationsRoute", defaultLang);
    app.get(`${path}/`,  (req, res) => {

        let requestedFiles;
        let lang = req.query.lang || defaultLang;
        let requestedFilesQuery = req.query.extrafiles ;
        
        if (requestedFilesQuery) {
            requestedFiles = requestedFilesQuery.split("/");
        }


        let translationsFilesListPath = values[lang];
        if (!requestedFilesQuery) {
            requestedFiles = [translationsFilesListPath[0]];
        };

       

        console.log("requestedFiles", requestedFiles);
        console.log("translationsFilesListPath", translationsFilesListPath);
        
        
        return res.status(404).json({ message: "Not found" });
  
        
  
        console.log("translationsFilesListPath", translationsFilesListPath);
        
        if (!translations) {
          lang = defaultLang;
        }
    
        translations = require(values[lang]);
    
        if (!lang || !translations) {
          return res.status(404).json({ message: "Not found" });
        }
    
        console.log("translations", translations);
        res.json(translations);
      });
  }
  
module.exports = { createMainTranslationsRoute }