<%- banner %>
var React = require( 'react' );

exports.injections = [ 'axReactRender' ];
exports.create = function( reactRender ) {

   var message  = 'Hello World!';

   return {
      onDomAvailable: function() {
         reactRender( <div className="panel panel-primary">
            <div className="panel-heading">
               <h3 className="panel-title">The <em>react-hello-world-widget</em> says ...</h3>
            </div>
            <div className="panel-body">
               <h1>{message}</h1>
            </div>
         </div> );
      }
   };
};
