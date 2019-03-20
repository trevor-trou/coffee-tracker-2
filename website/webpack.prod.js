const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.jsx',
    output: {
        path: path.resolve(__dirname, 'dist_prod'),
        filename: 'js/[name].bundle.js'
    },
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
            { from: "./node_modules/popper.js/dist/umd/popper.min.js", to: "./js/popper.min.js" },
            { from: "./src/images/favicon-16x16.png", to: "./images/favicon-16x16.png" },
            { from: "./src/images/favicon-32x32.png", to: "./images/favicon-32x32.png" },
            { from: "./src/images/favicon-96x96.png", to: "./images/favicon-96x96.png" }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.DefinePlugin({
            'API_BASE_URL': JSON.stringify('https://coffee-api.trouchon.com')
        })
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