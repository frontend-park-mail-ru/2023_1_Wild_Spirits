//import path from "path";

import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(filename);

const config = {
    entry: {
        app: "./src/index.ts",
    },
    output: {
        filename: "[name].js",
        publicPath: "/",
        path: path.resolve(__dirname, "./dist"),
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: "file-loader",
                options: {
                    outputPath: "assets",
                    name: "[name].[ext]",
                },
            },
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader",
                options: {
                    helperDirs: path.resolve(__dirname, "./src/modules/handlebars"),
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
        }),
        new CopyWebpackPlugin({ patterns: [{ from: path.resolve(__dirname, "./src/assets"), to: "assets" }] }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
        }),
        new ForkTsCheckerWebpackPlugin({
            logger: console,
        }),
    ],
    resolve: {
        extensions: [".js", ".ts", "css", "img"],
        modules: [__dirname + "/src", "node_modules"],
        alias: {
            handlebars: "handlebars/dist/handlebars.js",
            //"handlebars.runtime": "handlebars/dist/handlebars.runtime.js",
        },
    },
    mode: "development",
    devtool: "eval-cheap-source-map",
    devServer: {
        // devMiddleware: {
        //     writeToDisk: true,
        // },
        static: {
            directory: path.resolve(__dirname, "./dist"),
        },
        port: 8080,
        historyApiFallback: true,
    },
};

export default config;
