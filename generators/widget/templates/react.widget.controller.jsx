<%- banner %>
var React = require( 'react' );

exports.injections = [ 'axReactRender' ];
exports.create = function( reactRender ) {

   // TODO: add your implementation here

   return {
      onDomAvailable: function() {

      }
   };
};
