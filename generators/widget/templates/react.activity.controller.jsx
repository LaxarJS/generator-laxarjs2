<%- banner %>
import React from 'react';
import { injections } from 'laxar-react-adapter';

export default class <%= reactClassName %> extends React.Component {
   static [ injections ] = [ 'axContext' ];

   constructor( props ) {
      super( props );
      const [ context ] = props.injections;
      // TODO: add your implementation here
   }

   render() {
      return <div style={{display: 'none'}}/>;
   }
}
