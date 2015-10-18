var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);

config.entry = {
    main: './main.js',
    admin: './admin.js',
    vendor: './vendor.js'
};

config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
        "process.env": {
            // this has an effect on the react lib size
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
]);

module.exports = config;
