var path = require('path');
var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');
var BundleTracker = require('webpack-bundle-tracker');

var config = Object.create(baseConfig);
var publicPath = 'http://localhost:4000';
var rootPath = path.join(__dirname, 'app');

config.devtool = 'eval-source-map';
config.debug = true;
config.entry = {
    main: [
        'webpack-dev-server/client?' + publicPath,
        './main.js'
    ],
    vendor: [
        'webpack-dev-server/client?' + publicPath,
        './vendor.js'
    ]
};

config.output.publicPath = 'http://localhost:4000/static/bundles/';

config.plugins = config.plugins.concat([
    new webpack.NoErrorsPlugin(),
    new BundleTracker({ path: rootPath, filename: './webpack-stats.json' }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    })
]);

module.exports = config;
