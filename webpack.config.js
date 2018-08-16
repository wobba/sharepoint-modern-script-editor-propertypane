const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        'editor-pop-up': './src/index.ts',
        'editor-pop-up.min': './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'bundles'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'myLib',
        umdNamedDefine: true
    },
    externals: {
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    devtool: 'inline-source-map',

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader'
                }
            ],
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    includePaths: [require('path').resolve(__dirname, 'node_modules')]
                }
            }]
        }]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ]
    }
}