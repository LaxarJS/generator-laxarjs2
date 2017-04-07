<%- banner %>
const path = require( 'path' );
const pkg = require( './package.json' );

const webpack = require( 'laxar-infrastructure' ).webpack( {
   context: __dirname,
   resolve: {
      extensions: [ '.js', '.jsx' ]
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: path.resolve( __dirname, 'node_modules' ),
            loader: 'babel-loader'
         }
      ]
   }

} );


module.exports = [
   webpack.library()
];
