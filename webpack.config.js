import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(filename);
export const createConf = (env, argv) => {
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
                    use: [
                        {
                            loader: "style-loader",
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
                            loader: "resolve-url-loader",
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "assets",
                        name: "[name].[ext]",
                        publicPath: "/",
                    },
                },
                {
                    test: /\.handlebars$/,
                    loader: "handlebars-loader",
                    options: {
                        helperDirs: path.resolve(__dirname, "./src/modules/handlebars"),
                        partialDirs: [path.resolve(__dirname, "./src/templates")],
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
            new ForkTsCheckerWebpackPlugin({
                logger: console,
            }),
        ],
        resolve: {
            extensions: [".js", ".ts", "css", "img"],
            modules: [__dirname + "/src", "node_modules"],
            alias: {
                handlebars: "handlebars/dist/handlebars.js",
                "@style": path.resolve(__dirname, "./src/assets/scss/style.scss"),
            },
        },
        mode: argv.mode,
        devServer: {
            static: {
                directory: path.resolve(__dirname, "./dist"),
            },
            port: 8080,
            historyApiFallback: true,
        },
    };

    if (argv.mode === "development") {
        config.devtool = "eval-cheap-source-map";
    }

    return config;
};

export default createConf;
