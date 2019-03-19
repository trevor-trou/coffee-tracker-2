const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    devtool: 'source-map',
    watch: true,
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
        new CopyWebpackPlugin([
            { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "./css/bootstrap.min.css" },
            { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "./js/bootstrap.min.js" },
            { from: "./node_modules/jquery/dist/jquery.min.js", to: "./js/jquery.min.js" },
            { from: "./node_modules/popper.js/dist/umd/popper.min.js", to: "./js/popper.min.js" }
        ])
    ],
    stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: false,
        // our additional options
        moduleTrace: true,
        errorDetails: true,
    }
}