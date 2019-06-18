var path = require("path");

const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const htmlPlugin = new HtmlPlugin({
  template: "./index.html",
  filename: "./index.html"
});

const copyPlugin = new CopyPlugin([
  {
    from: "./manifest.json",
    to: "manifest.json"
  }
]);

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64:8]",
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin, copyPlugin]
};
