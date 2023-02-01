const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FileManagerWebPackPlugin = require("filemanager-webpack-plugin");

const moduleFederationConfig = {
  name: "remote_a",
  filename: "remoteEntry.js",
  exposes: {
    "./layout": "./src/components/layout/layout",
    "./top_navigation": "./src/components/top-navigation/top-navigation",
    "./global_css": "./src/styles/global.css",
  },
  remotes: {
    remote_a: "remote_a@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, eager: true, requiredVersion: deps.react },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: deps["react-dom"],
    },
    "react-router-dom": {
      singleton: true,
      eager: true,
      requiredVersion: deps["react-router-dom"],
    },
  },
};
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  return {
    entry: "./src/index.ts",
    mode: "development",
    devtool: "source-map",
    output: {
      publicPath: "auto",
    },
    devServer: {
      port: 3001,
      open: false,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "dts-loader",
              options: {
                name: moduleFederationConfig.name, // The name configured in ModuleFederationPlugin
                exposes: moduleFederationConfig.exposes,
                typesOutputDir: "exposedTypes", // Optional, default is '.wp_federation'
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  localIdentName: "[name]_[local]_[sha1:hash:hex:4]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "public/images/[name].[ext]",
          },
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          use: "file-loader",
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new ModuleFederationPlugin(moduleFederationConfig),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new ForkTsCheckerWebpackPlugin(),
      new FileManagerWebPackPlugin({
        events: {
          onEnd: {
            copy: isProduction
              ? [
                  {
                    source: "public/host.config.json",
                    destination: "out/host.config.json",
                  },
                ]
              : [],
            archive: [
              {
                source: `./exposedTypes/${moduleFederationConfig.name}`,
                destination: `./${isProduction ? "dist" : "public"}/${
                  moduleFederationConfig.name
                }-dts.tgz`,
                format: "tar",
                options: {
                  gzip: true,
                },
              },
            ],
          },
        },
      }),
    ],
  };
};
