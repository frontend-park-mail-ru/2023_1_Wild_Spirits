//import path from "path";

import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

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
                test: /\.handlebars$/,
                loader: "handlebars-loader",
                options: {
                    helperDirs: path.resolve(__dirname, "./src/modules/handlebars"),
                    //precompileOptions: {
                    //    knownHelpersOnly: false,
                    //},
                    //runtime: path.resolve(__dirname, "./src/modules/handlebars.cjs"),
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
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [__dirname + "/src", "node_modules"],
        alias: {
            handlebars: "handlebars/dist/handlebars.js",
            //"handlebars.runtime": "handlebars/dist/handlebars.runtime.js",
        },
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
