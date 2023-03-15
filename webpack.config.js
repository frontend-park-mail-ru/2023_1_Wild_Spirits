//import path from "path";

import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(filename);
console.log(__dirname, path.resolve(__dirname, "dist"), path.join(__dirname, "dist"));

const config = {
    entry: {
        handlebars: "./src/handlebars.runtime.min-v4.7.7.js",
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
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [__dirname + "/src", "node_modules"],
    },
    mode: "development",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "./dist"),
        },
        port: 8080,
    },
};

export default config;
