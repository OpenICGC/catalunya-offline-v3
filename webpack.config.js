const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const path = require('path');
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = (env) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'inline-source-map',
  devServer: {
    open: true,
    port: 8080
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      '@mui/material': path.resolve('./node_modules/@mui/material'),
      '@mui/styles': path.resolve('./node_modules/@mui/styles'),
      '@mui/icons-material': path.resolve('./node_modules/@mui/icons-material')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
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
        test: /\.(svg|xml|csv|geojson|gpx|kml)$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader'
      },
      {
        test: /\.(zip)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: env.test ? [
    new DotenvWebpackPlugin()
  ] : [
    new HtmlWebPackPlugin({
      favicon: './resources/logo.svg',
      template: './src/template.html',
      filename: './index.html',
      chunks: ['main']
    }),
    new DotenvWebpackPlugin(),
    ...(process.env.SENTRY_AUTH_TOKEN ? [new SentryWebpackPlugin({
      org: 'geomatico',
      project: 'catoffline',
      include: './dist',
      authToken: process.env.SENTRY_AUTH_TOKEN
    })] : [])
  ]
});
