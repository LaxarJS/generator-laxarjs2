/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const { bold } = require('chalk');
const path = require( 'path' );
const { sync: mkdir } = require( 'mkdirp' );
const Generator = require( 'yeoman-generator' );
const { dependencies, devDependencies } = require( './dependencies.json' );
const {
   getBanner,
   createBanner,
   dependenciesForPackageJson,
   verbatimFileObject
} = require( '../../lib/utils' );
const technologies = require( '../../lib/technologies' );
const commonPrompts = require( '../../lib/common-prompts' );

module.exports = class extends Generator {

   constructor( args, opts ) {
      super( args, opts );
      this.option( 'banner', {
         type: String,
         defaults: '',
         desc: 'Path to a text file whose contents are prepended as (license) header to source files'
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   initializing() {
      const pathBasename = path.basename( this.destinationRoot() );

      this.vars = {
         name: pathBasename,
         description: '',
         license: this.config.get( 'license' ) || 'none',
         homepage: this.config.get( 'homepage' ),
         author: this.config.get( 'author' ),
         port: '8000',
         specRunnerPort: '8100',
         technologies: [],
         version: '0.1.0-pre',
         widgets: true,
         cssClassName: '',
         banner: getBanner( this ),
         sourcefileExtensionExpression: '(jsx?)',
         sourcefileExtensionList: '[ \'.js\', \'.jsx\' ]'
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   prompting() {

      /* eslint-disable max-len */
      this.log( `
LaxarJS application generator v${this.rootGeneratorVersion()}

This generator will create the basic file- and directory structure of a LaxarJS application in the current directory.

For more information about a LaxarJS application, please see the docs at
https://github.com/LaxarJS/laxar/blob/master/docs/concepts.md#laxarjs-concepts`
      );
      /* eslint-enable max-len */

      const prompts = [
         ...commonPrompts.prompts( 'application', this.vars ),
         {
            type: 'input',
            name: 'port',
            message: 'Development server port:',
            default: this.vars.port,
            validate: _ => !isNaN( parseInt( _, 10 ) ) || 'Please enter a valid port number.'
         },
         {
            type: 'confirm',
            name: 'widgets',
            message: 'Should a set of example widgets be generated?',
            default: this.vars.widgets
         },
         {
            type: 'checkbox',
            name: 'technologies',
            message: 'Select widget implementation technologies to include:\n',
            default: this.vars.technologies,
            choices: technologies
               .filter( _ => !_.isBuiltIn )
               .map( _ => ({ name: _.name, value: _.integrationTechnology }) )
         }
      ];

      return this.prompt( prompts )
         .then( answers => {
            Object.assign( this.vars, answers );

            const selectedAdapters =
               technologies.filter( _ => this.vars.technologies.includes( _.integrationTechnology ) );

            const allDependencies = {
               dependencies: Object.assign( {}, dependencies ),
               devDependencies: Object.assign( {}, devDependencies )
            };
            selectedAdapters.forEach( _ => {
               Object.assign( allDependencies.dependencies, _.dependencies );
               Object.assign( allDependencies.devDependencies, _.devDependencies );
            } );
            this.vars.dependenciesString = dependenciesForPackageJson( allDependencies.dependencies );
            this.vars.devDependenciesString = dependenciesForPackageJson( allDependencies.devDependencies );

            this.vars.cssClassName = this.vars.name.replace( /[_\s]+/, '-' );
            this.vars.banner = createBanner( this );
            this.vars.specRunnerPort = `${parseInt( this.vars.port, 10 ) + 100}`;
         } );
   }

   configuring() {
      this.config.set( {
         author: this.vars.author,
         homepage: this.vars.homepage,
         license: this.vars.license,
         banner: this.vars.banner
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   writing() {
      const filesToCopy = verbatimFileObject( [
         'debug.html',
         'index.html',
         'init.js',
         'laxar.config.js',
         'package.json',
         'README.md',
         'webpack.config.js'
      ] );
      filesToCopy[ '_.gitignore' ] = '.gitignore';

      if( this.vars.widgets ) {
         filesToCopy[ 'demo.application' ] = 'application';
      }
      else {
         filesToCopy[ 'bare.application' ] = 'application';
         mkdir( path.join( this.destinationRoot(), 'application', 'widgets' ) );
      }
      mkdir( path.join( this.destinationRoot(), 'application', 'themes' ) );

      Object.keys( filesToCopy ).forEach( sourceFile => {
         this.fs.copyTpl(
            this.templatePath( sourceFile ),
            this.destinationPath( filesToCopy[ sourceFile ] ),
            this.vars
         );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   end() {
      this.log( `
Now run ${bold.italic( 'npm install' )} to get tools and dependencies.
Then you can run ${bold.italic( 'grunt start' )} to start the developing server (port ${this.vars.port}).
Have fun developing your LaxarJS application!

Also, please have a look at the manuals:
https://github.com/LaxarJS/laxar/blob/master/docs/manuals/index.md`
      );
   }

};
