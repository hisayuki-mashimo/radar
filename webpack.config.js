const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const typedCssModulesLoader = "typed-css-modules-loader?camelCase";

module.exports = {
  entry: path.resolve(__dirname, 'src/App.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(j|t)s(x?)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        enforce: "pre",
        test: /\.s?css$/,
        loader: typedCssModulesLoader,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            //cacheLoader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
                camelCase: true,
                localIdentName: "[local]_[hash:base64:8]",
                minimize: false,
                sourceMap: true,
              },
            },
            /*
            {
              loader: "postcss-loader",
              options: {
                plugins: loader => [
                  new IconfontWebpackPlugin(
                    getIconFontWebpackPluginOptions(iconfontWebpackPluginOptions, loader)),
                  new AutoPrefixer(autoPrefixerOptions),
                ],
              },
            },
            */
            {
              loader: "sass-loader",
              options: {
                includePaths: ["assets/stylesheets"],
                camelCase: true,
              },
            },
            /*
            {
              loader: "style-loader",
            },
            */
          ],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: [
      path.resolve(__dirname, "./"),
      path.resolve(__dirname, "./src/"),
      path.resolve(__dirname, "./node_modules/"),
    ],
  }
};
