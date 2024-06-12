const path = require('path');

module.exports = {
  entry: './i18n4e.min.ts',
  output: {
    filename: 'i18n4e.min.js',
    path: path.resolve(__dirname, '../client-dist'), 
    library: 'i18n4e',
    libraryTarget: 'umd',
    libraryExport: 'default', 
    globalObject: 'this',
  },
  mode: 'production', 
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.base.json')
          }
        },
        exclude: [/node_modules/, /src/], 
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], 
  },
};
