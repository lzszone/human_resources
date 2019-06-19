const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react',
            '@babel/preset-env'
          ],
          plugins: [
            [
              "styled-components", {
                "displayName": true
              }
            ],
            "macros"
          ]
        }
      }
    ]
  },
  devServer: {
    contentBase: 'dist',
    port: 9000,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    publicPath: '/'
  },
  mode: 'development'
}