const express = require('express');
const { i18n4e } = require('i18n4e'); // import the i18n4e 

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

i18n4e.init(app,{
  serverSideTranslation: true, // initialize the server side translation
  options:{
    mainFile:"main", // define the file main.js as the main file for each language
    defaultLang:"en", // define the default language as english (default is en)
    // other server side translation mode settings are in the sst.config.json file...
  }

})


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/next', (req, res) => {
  res.render('next');
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
