const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    rules: [{
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
              "displayName": false
            }
          ],
          "macros",
          "@babel/plugin-proposal-class-properties"
        ]
      }
    },{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.(png|jpg|jpeg|ttf|woff|svg|gif|eot)$/,
      loader: 'file-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.png', '.jpg', '.jpeg']
  },
  mode: 'production'
}