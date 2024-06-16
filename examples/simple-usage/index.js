const express = require('express');
const {i18n4e} = require('i18n4e');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

i18n4e.init(app);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});