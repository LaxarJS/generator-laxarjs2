<%- banner %>
const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const WebpackJasmineHtmlRunnerPlugin = require( 'webpack-jasmine-html-runner-plugin' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = ( env = {} ) => {

   const outputPath = env.production ? 'dist/' : 'build/';

   const widgetsRoot = require( './laxar.config.js' ).paths.widgets;

   return Object.assign( {
      devtool: '#source-map',
      entry: {
         'init': './init.js'
      },

      output: {
         path: path.resolve( __dirname, outputPath ),
         publicPath: outputPath,
         filename: env.production ? '[name].bundle.min.js' : '[name].bundle.js'
      },

      plugins: [
         ...( env.production ? [ new ExtractTextPlugin( { filename: '[name].bundle.css' } ) ] : [] ),
         ...( env.browserSpec ? [ new WebpackJasmineHtmlRunnerPlugin() ] : [] ),
         new webpack.optimize.ModuleConcatenationPlugin()
      ],

      resolve: {
         modules: [ path.resolve( __dirname, 'node_modules' ) ],
         extensions: <%- webpackResolveExtensionsString %>,
         alias: {
            'default.theme': 'laxar-uikit/themes/default.theme'<%- webpackResolveAliases %>
         }
      },

      module: {
         rules: [
            {
               test: /.js$/,
               exclude: /node_modules/,
               loader: 'babel-loader'
            },
            {
               test: /.spec.js$/,
               exclude: /node_modules/,
               loader: 'laxar-mocks/spec-loader'
            },
            {  // load styles, images and fonts with the file-loader
               // (out-of-bundle in build/assets/)
               test: /\.(gif|jpe?g|png|ttf|woff2?|svg|eot|otf)(\?.*)?$/,
               loader: 'file-loader',
               options: {
                  name: env.production ? 'assets/[name]-[sha1:hash:8].[ext]' : 'assets/[path]-[name].[ext]'
               }
            },
            {  // ... after optimizing graphics with the image-loader ...
               test: /\.(gif|jpe?g|png|svg)$/,
               loader: 'img-loader?progressive=true'
            },
            {  // ... and resolving CSS url()s with the css loader
               // (extract-loader extracts the CSS string from the JS module returned by the css-loader)
               test: /\.(css|s[ac]ss)$/,
               loader: env.production ?
                  ExtractTextPlugin.extract( {
                     fallback: 'style-loader',
                     use: 'css-loader',
                     publicPath: ''
                  } ) :
                  'style-loader!css-loader?sourceMap'
            },
            {
               test: /[/]default[.]theme[/].*[.]s[ac]ss$/,
               loader: 'sass-loader',
               options: require( 'laxar-uikit/themes/default.theme/sass-options' )
            }<%- webpackModuleRules %>
         ]
      }
   }, env.browserSpec ? {
      entry: WebpackJasmineHtmlRunnerPlugin.entry(
         './' + path.join( widgetsRoot, '**/spec/*.spec.js' )
      ),
      output: {
         path: path.resolve( __dirname, 'spec-output' ),
         publicPath: '/spec-output/',
         filename: '[name].bundle.js'
      }
   } : {} );

};
