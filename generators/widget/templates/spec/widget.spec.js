<%- banner %>
var axMocks = require( 'laxar-mocks' );

describe( 'The <%= name %>', function() {

   beforeEach( axMocks.setupForWidget() );

   beforeEach( function() {
      axMocks.widget.configure( {} );
   } );

   beforeEach( axMocks.widget.load );

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'still needs some tests', function() {
      // ... first test here
   } );


} );
