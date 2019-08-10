const path = require('path');
const distPath = path.join(__dirname, '/public');

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
  }
};

module.exports = config;
