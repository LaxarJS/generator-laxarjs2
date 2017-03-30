/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
 const Generator = require( 'yeoman-generator' );

 module.exports = class extends Generator {

    constructor( args, opts ) {
       super( args, opts );
    }

    method1() {
       this.log('control: method 1 just ran');
    }

    method2() {
       this.log('control: method 2 just ran');
    }

};
