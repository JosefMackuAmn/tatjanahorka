const path = require('path');

module.exports = {
    entry: './src/client/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public', 'js')
    },
    mode: 'development',
    devtool: 'eval-cheap-module-source-map'
};