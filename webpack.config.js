const path = require('path');
const distPath = path.join(__dirname, '/public');
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

const config = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      }
    ]
  },
  plugins: [
    // Оставляем только одну локаль.
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    }),
  ],
};

module.exports = config;
