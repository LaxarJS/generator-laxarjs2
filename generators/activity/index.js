/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const Generator = require( 'yeoman-generator' );

module.exports = class extends Generator {

   constructor( args, opts ) {
      super( args, opts );
      this.argument( 'name', {
         type: String,
         required: false,
         desc: 'Name of the artifact'
      } );
      this.option( 'directory', {
         type: String,
         defaults: '',
         desc: 'Base directory for activities'
      } );
      this.option( 'banner', {
         type: String,
         defaults: '',
         desc: 'Path to a file with a banner'
      } );
      this.options.activity = true;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   prompting() {
      this.composeWith( require.resolve( '../widget' ), this.options );
   }

};
