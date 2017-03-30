<%- banner %>
var laxar = require( 'laxar' );

exports.injections = [ 'axWithDom' ];
exports.create = function( axWithDom ) {
   return {
      onDomAvailable: function() {
         axWithDom( function( element ) {
            element.querySelector( 'h1' ).innerText = 'Hello World!';
         } );
      }
   }
}
