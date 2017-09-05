// webpack.production.config.js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var providePlugin = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery',
});

module.exports = {
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/build",
        filename: "[name]-[hash].js",
        chunkFilename:'chunk.[name].js'
    },
    devtool: 'none',
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }, {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader', 
                        options: { 
                            importLoaders: 1 
                        } 
                    },
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [

        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),

        new ExtractTextPlugin("styles.css")
    ],
    externals:{
        'jquery':'window.jQuery'
    }
};