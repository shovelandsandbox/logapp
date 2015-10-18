var path = require('path');
var webpack = require('webpack');

var rootPath = path.join(__dirname, 'app');
var staticPath = path.join(rootPath, 'assets');

module.exports = {
    context: path.join(staticPath, 'js'),
    output: {
        filename: '[name].bundle.js',
        path: path.join(staticPath, 'js/bundled')
    },

    module: {
        loaders: [
            { test: /jquery\.js$/, loader: 'expose?$!expose?jQuery' },
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
            { test: /\.json$/, loader: 'json' }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared', 'shared.bundle.js'),
    ]
};
