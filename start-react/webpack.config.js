// webpack.config.js

var path = require("path");

module.exports = {
    entry:  {
    	app: './src/main.js'  //演示单入口文件
    },
    output: {
        path: path.join(__dirname, 'build/js'),  //打包输出的路径
        filename: '[name].js'                    //打包后的名字
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style!css'},
            { test: /\.jsx?$/, loader: 'babel', query: { presets: ['react'] } },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    }
    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin('common.js')
    // ]
};