const path = require("path");
module.exports = {
  devServer: {
    contentBase: __dirname
  },
  target: 'node',
  devtool: 'source-map',
  entry: path.join(__dirname, "index.js"),
  output: {
    filename: "main.js",
    path: path.join(__dirname, 'dist'),
    publicPath: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  }
};
