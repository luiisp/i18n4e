const express = require("express");
const { i18n4e } = require("i18n4e"); // import the i18n4e
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/client-dist", express.static("client-dist"));

i18n4e.init(app, {
  mainFile: "main", // define the file main.js as the main file for each language
  defaultLang: "en", // define the default language as english (default is en)
  dev: true, // set to true to enable the development mode
  enableClient: true, // set to true to enable the client
  useLangSession: true, // set to true to enable the language session
  i18n4eDefaultSession: true, // use default session
//  langNameInPath: true, // set to true to enable the language path ex: /home/en or /home/es ...
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/next", (req, res) => {
  res.render("next");
});


app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
