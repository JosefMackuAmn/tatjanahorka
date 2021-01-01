const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './src/client/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public', 'jsw')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src', 'client', 'js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};