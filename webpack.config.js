import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";

import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(filename);
export const createConf = (env, argv) => {
    const isDev = argv.mode === "development";

    let config = {
        entry: {
            app: "./src/index.tsx",
        },
        output: {
            filename: "[name].js",
            publicPath: "/",
            path: path.resolve(__dirname, "./dist"),
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js|tsx|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                modules: {
                                    mode: "local",
                                    auto: true,
                                    exportGlobals: true,
                                    localIdentName: "[local]--[hash:base64:5]",
                                    localIdentHashSalt: "my-custom-hash",
                                },
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                postcssOptions: {
                                    config: false,
                                    plugins: [
                                        autoprefixer,
                                        cssnano({
                                            preset: [
                                                "default",
                                                {
                                                    discardComments: {
                                                        removeAll: true,
                                                    },
                                                },
                                            ],
                                        }),
                                    ],
                                },
                            },
                        },
                        {
                            loader: "resolve-url-loader",
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    loader: "file-loader",
                    exclude: /node_modules/,
                    options: {
                        outputPath: "assets",
                        name: "[name].[ext]",
                        publicPath: "/",
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: false,
                template: "./src/index.html",
                filename: "index.html",
                scriptLoading: "blocking",
                inject: "body",
                favicon: "./src/favicon.ico",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, "./src/assets/img"), to: "assets/img" },
                    { from: path.resolve(__dirname, "./src/assets/fonts"), to: "assets/fonts" },
                    { from: path.resolve(__dirname, "./src/sw.js"), to: "" },
                ],
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: "[file].map",
            }),
            new ForkTsCheckerWebpackPlugin({}),
        ],
        resolve: {
            extensions: [".js", ".ts", ".jsx", ".tsx", "css", "scss", "img"],
            modules: [__dirname + "/src", "node_modules"],
            alias: {
                "@style": path.resolve(__dirname, "./src/assets/scss/style.scss"),
                "@config": path.resolve(__dirname, isDev ? "./src/config.js" : "./src/config_deploy.js"),
            },
        },
        externals: {
            "yandex-maps": "ymaps",
        },
        mode: argv.mode,
        devServer: {
            static: {
                directory: path.resolve(__dirname, "./dist"),
            },
            port: 8080,
            historyApiFallback: true,
        },
        target: ["browserslist"],
    };

    if (isDev) {
        config.devtool = "eval-cheap-source-map";
    } else {
        config.plugins.push(new MiniCssExtractPlugin());
    }

    return config;
};

export default createConf;
