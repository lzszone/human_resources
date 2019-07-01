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
            "macros",
            "@babel/plugin-proposal-class-properties"
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx']
  },
  devServer: {
    contentBase: 'dist',
    port: 9000,
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    publicPath: '/',
    proxy: {
      // '/api': 'http://app.recruit.test.lyml.me',
      '/api': 'http://dummy.restapiexample.com/',
    }
  },
  mode: 'development'
}