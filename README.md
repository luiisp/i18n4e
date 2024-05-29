
<p>
  <a href="/" target="blank"><img src="https://github.com/luiisp/i18n4e/assets/115284250/5338d39e-7cfd-4bc5-b5f1-ae4c708d5b9d" width="200" alt="i18n4e logo" /></a>
</p>

# i18n4e: i18n for Express Js 🌐👾
[![npm version](https://badge.fury.io/js/i18n4e.svg)](https://badge.fury.io/js/i18n4e)
[![npm](https://img.shields.io/npm/dt/i18n4e.svg)](https://www.npmjs.com/package/i18n4e)
[![yarn](https://img.shields.io/badge/yarn-1.0.0-blue.svg)](https://yarnpkg.com/en/package/i18n4e)
![GitHub license](https://img.shields.io/github/license/luiisp/i18n4e.svg)


i18n4e is a package that offers a modern, quick and easy way to add internationalization support to your Express Js application.

> Please do not download this package yet, the source files are being developed, the first stable release will be released soon!

## Loading.. 🚧
This package is under development, please wait for the first release.

## 🚀 Installation
```bash
npm install i18n4e
```
or 

```bash
yarn add i18n4e
```

### For client-side:
> Only if using client side translation mode **(CST)**

```html
<script src="https://cdn.jsdelivr.net/npm/i18n4e/client-dist/i18n4e.min.js"></script>
```

or 

```html
<script src="/node_modules/i18n4e/client-dist/i18n4e.min.js"></script>
```


# 📚 Docs

To see the full documentation, please visit the [official documentation](https://luiisp.github.io/i18n4e-docs).

# 📖 Simple Usage In 6 Steps
> In this simple example we will use the server-side translation mode **(SST)**

1. Install the package
    ```bash
    npm install i18n4e
    ```

2. Import the package
      ```javascript
      const {i18n4e} = require('i18n4e');
      ```

3. Create a _locales folder in the root of your project and add the locales files
    ```
    project
    ├── node_modules
    ├── package.json
    ├── index.js
    └── _locales
        ├── en
        │   └── translation.json
        ├── pt_br
        │   └── translation.json
        └── es
            └── translation.json

    ```

4. Add variables in the translation.json files for each language

├── en/**translation.json**
```json
{
  "hello-world": "Hello World!",
}
```
├── pt_br/**translation.json**
```json
{
  "hello-world": "Olá Mundo!",
}
```
├── es/**translation.json**
```json
{
  "hello-world": "Hola Mundo!",
}
```

5. In your view files (example: index.ejs or index.html) add i18nID attributes to the elements you want to translate
    ```html
    <h1 i18nID="hello-world">Hello World!</h1>
    ```


6. Init i18n4e with your express app and active the server-side translation mode
    ```javascript
    i18n4e.init(app,{
      serverSideTranslation: true, // enable server-side translation mode
      options:{
        defaultLang:'en', // define the default language
      }
    })
    ```

Its done! Now your application is ready to be translated into multiple languages.






# 📦 Benefits

- Modern syntax written with typescript
- Fast and Scalable Execution
- ES6/ESM and Common Js support
- Easy to use
- Client-side translation mode based on JSON (CST)
- Server-side translation (SST)
- HTML/EJS support
