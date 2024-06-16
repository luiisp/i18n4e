const express = require('express');
const { i18n4e } = require('i18n4e');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
i18n4e.init(app,{
    enableClient: true, // allows the client to access the i18n4e object
    useLangSession: true, // uses the session to store the language
    i18n4eDefaultSession: true,// If the app does not have a session you can activate it to use the default i18n4e session
})

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});