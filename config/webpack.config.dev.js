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
      exclude: /node_modules/,
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
  devServer: {
    contentBase: 'dist',
    port: 10001,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    publicPath: '/',
    progress: true,
    proxy: {
      '/api': {
        // target: 'http://api.520work.cn/',
        target: 'http://192.168.50.183:21001/',
        changeOrigin: true,
        secure: false
      }
    }
  },
  mode: 'development'
}