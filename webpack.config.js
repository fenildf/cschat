const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    devtool: 'eval-source-map',
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
                // 专供bootstrap方案使用的，忽略bootstrap自带的字体文件
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                include: /glyphicons/,
                loader: 'null-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules|bootstrap/,
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
                test: /\.css$/,
                include: /bootstrap/,
                use: [
                    'style-loader', 'css-loader',
                ],
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
            },
            {
                // css 中小于 50kb 的图片转换为base64
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=51200&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        /* 全局shimming */
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new webpack.BannerPlugin('By victorsun, www.csxiaoyao.com, QQ:1724338257'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"// 创建插件实例，并传入相关参数
        }),
        new webpack.HotModuleReplacementPlugin()// 热加载插件
    ]
};