const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const path = require('path');

module.exports = (env) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'inline-source-map',
  devServer: {
    open: true,
    port: 8080
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      react: path.resolve('./node_modules/react'),
      '@mui/material': path.resolve('./node_modules/@mui/material'),
      '@mui/styles': path.resolve('./node_modules/@mui/styles'),
      '@mui/icons-material': path.resolve('./node_modules/@mui/icons-material')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|xml)$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader'
      }
    ]
  },
  plugins: env.test ? [
    new DotenvWebpackPlugin({
      safe: true // load '.env.example' to verify the '.env' variables are all set
    })
  ] : [
    new HtmlWebPackPlugin({
      favicon: './resources/logo.svg',
      template: './src/template.html',
      filename: './index.html',
      chunks: ['main']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static'
        }
      ]
    }),
    new DotenvWebpackPlugin({
      safe: true
    })
  ]
});
