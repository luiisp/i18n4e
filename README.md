
<p>
  <a href="/" target="blank"><img src="https://github.com/luiisp/i18n4e/assets/115284250/5338d39e-7cfd-4bc5-b5f1-ae4c708d5b9d" width="200" alt="i18n4e logo" /></a>
</p>

# i18n4e: i18n for Express Js 🎨🌍
[![npm version](https://badge.fury.io/js/i18n4e.svg)](https://badge.fury.io/js/i18n4e)
[![npm](https://img.shields.io/npm/dt/i18n4e.svg)](https://www.npmjs.com/package/i18n4e) 
![GitHub license](https://img.shields.io/github/license/luiisp/i18n4e.svg)


i18n4e is a package that offers a modern, quick and easy way to add internationalization support to your Express Js application.

## 🚀 Installation
```bash
npm install i18n4e
```
or 

```bash
yarn add i18n4e
```

### In the client:

```html
<script src="https://cdn.jsdelivr.net/npm/i18n4e/client-dist/i18n4e.min.js"></script>
```

or 

```html
<script src="/node_modules/i18n4e/client-dist/i18n4e.min.js"></script>
```


# 📚 Docs

To see the full documentation, please visit the [official documentation](https://i18n4e.vercel.app/docs).

# 📖 Simple Usage In 6 Steps

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
  "hello-world": "Hello World!"
}
```
├── pt_br/**translation.json**
```json
{
  "hello-world": "Olá Mundo!"
}
```
├── es/**translation.json**
```json
{
  "hello-world": "Hola Mundo!"
}
```

5. In your view files (example: index.ejs or index.html) add i18nID attributes to the elements you want to translate
    ```html
    <h1 i18nID="hello-world">Hello World!</h1>
    ```


6. Start i18n4e on your file by passing your app express
    ```javascript
    i18n4e.init(app,{
        defaultLang:'en', // define the main language 
    })
    ```
[use this example](https://github.com/luiisp/i18n4e/tree/main/examples/simple-usage).
Its done! Now your application is ready to be translated into multiple languages.

**For more examples and configurations, please visit the [Examples](https://github.com/luiisp/i18n4e/tree/main/examples/).**



# 💭 Philosophy
**i18n4e**, created with ❤️ by [Luiisp](https://github.com/luiisp), is a package with the philosophy of demystifying the difficulty of implementing i18n in web applications. At a high level, you can make various complex configurations using only boolean options.

# 📦 Benefits

- Modern syntax written with typescript
- Fast and Scalable Execution
- ES6/ESM and Common Js support
- Easy to use
- Change language by session support
- HTML/EJS support

# 🕶️ Examples
We have several ready-made project examples using i18n4e that you can view and use as you wish.

#### [Click to see them 😎](https://github.com/luiisp/i18n4e/tree/main/examples)

# 💪 Contributing

**We welcome contributions to the i18n4e project!** If you would like to contribute, **please follow these steps:**

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your desired changes to the codebase.
5. Test your changes to ensure they work as expected.
6. Commit your changes and push them to your forked repository.
7. Submit a pull request to the main i18n4e repository.

Please make sure to follow our [contribution guidelines](CONTRIBUTING.md) and adhere to our [code of conduct](CODE_OF_CONDUCT.md) when contributing.

We appreciate your contributions and look forward to working with you!



# 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

> inspired by chrome.i18n

> *Created with ❤️ by [luiisp](https://github.com/luiisp)*
