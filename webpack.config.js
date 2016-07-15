var path = require( 'path' );

var webpack = require( 'webpack' );
var LiveReloadPlugin = require( 'webpack-livereload-plugin' );


var CSS_Module_Loader_Pargram;

var plugins = [
    //@手动把公共的集中到这里
     new webpack.optimize.CommonsChunkPlugin( 'vendors', 'vendors.js' )
];
if (process.env.NODE_ENV === 'production' ) {
    console.log( 'export NODE_ENV=production' );

    plugins.push(
        new webpack.DefinePlugin( {
            'process.env': {
                'NODE_ENV': JSON.stringify( 'production' )
            }
        } ),
        new webpack.optimize.UglifyJsPlugin( {
            compress: { warnings: false }
        } )
    );
   

}else {
    console.log('export NODE_ENV=development');
    plugins.push(
        //live reload
        new LiveReloadPlugin( {
            port: 35729,
            appendScriptTag: true,
            ignore: null
        } )
    );

}

module.exports = {
    entry: {
        pageTest: path.resolve( __dirname, 'src/pageTest/index.js' ),
        /**
         * @自定义公共模块抽到这里
         */
        vendors: [ 'react', 'react-dom' ]
    },
    output: {
        path: path.join( __dirname, "/public/build/" ),
        filename: "[name].bundle.js",
        publicPath: "/build/",
        chunkFilename: "[name].chunk.min.js"

    },
    module: {
        loaders: [
            { test: /\.png$/, loader: "url-loader?limit=4000&name=img/[hash:12].[ext]" },
            { test: /\.jpg$/, loader: "file-loader" },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: [ 'es2015' ]
                }
            }
        ]
    },
    plugins: plugins
};