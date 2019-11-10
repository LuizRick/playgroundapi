const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: './bin/www',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'api.bundle.js',
    },
    target: 'node',
    plugins:[
        new webpack.DefinePlugin({
            'process.env.FLUENTFFMPEG_COV': false
        })
    ]
};