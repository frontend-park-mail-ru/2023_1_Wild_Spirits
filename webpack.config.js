//import path from "path";

import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(filename);
console.log(__dirname, path.resolve(__dirname, "dist"), path.join(__dirname, "dist"));

const config = {
    entry: {
        app: "./src/index.ts",
    },
    output: {
        filename: "[name].js",
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
                    // publicPath: "assets",
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
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
        static: {
            directory: path.resolve(__dirname, "./dist"),
        },
        port: 8080,
    },
};

export default config;
