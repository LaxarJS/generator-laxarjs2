<%- banner %>
import React from 'react';

export default class ReactHelloWorldWidget extends React.Component {

   constructor( props ) {
      super( props );
   }

   render() {
      const message  = 'Hello World!';
      
      return (
         <div className="panel panel-primary">
            <div className="panel-heading">
               <h3 className="panel-title">The <em>react-hello-world-widget</em> says ...</h3>
            </div>
            <div className="panel-body">
               <h1>{message}</h1>
            </div>
         </div>
      );
   }
}
