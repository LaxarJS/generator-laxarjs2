/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const { bold } = require( 'chalk' );
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
const { LICENSE_UNLICENSED } = require( '../../lib/constants' );

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
         author: this.config.get( 'author' ),
         banner: getBanner( this ),
         homepage: this.config.get( 'homepage' ),
         license: this.config.get( 'license' ) || LICENSE_UNLICENSED,
         privateModule: '',
         version: '0.1.0-pre',

         adapterIncludes: '',
         adapterModules: '[]',
         babelPluginsString: '[ "transform-object-rest-spread" ]',
         contentAreaWidgets: '[]',
         cssClassName: '',
         exampleWidgets: true,
         specRunnerPort: 8180,
         technologies: [],
         webpackResolveExtensionsString: '[ \'.js\', \'.jsx\' ]',
         webpackResolveAliases: '',
         webpackModuleRules: ''
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   prompting() {

      /* eslint-disable max-len */
      this.log( `
LaxarJS application generator v${this.rootGeneratorVersion()}

This generator will create the basic file- and directory structure of a LaxarJS application in the current directory.

For more information about a LaxarJS application, please see the docs at
https://laxarjs.org/docs/laxar-v2-latest/concepts/`
      );
      /* eslint-enable max-len */

      const prompts = [
         ...commonPrompts.prompts( 'application', this.vars ),
         {
            type: 'checkbox',
            name: 'technologies',
            message: 'Select integration technologies to include:\n',
            default: this.vars.technologies,
            choices: technologies
               .filter( _ => !_.isBuiltIn )
               .map( _ => ({
                  name: `${_.name} ("${_.integrationTechnology}")`,
                  value: `${_.integrationTechnology}`
               }) )
         },
         {
            type: 'confirm',
            name: 'exampleWidgets',
            message: 'Should a set of example widgets be generated?',
            default: this.vars.exampleWidgets
         }
      ];

      return this.prompt( prompts )
         .then( answers => {
            Object.assign( this.vars, answers );

            this.selectedAdapters = technologies.filter( _ =>
               _.isBuiltIn || this.vars.technologies.includes( _.integrationTechnology )
            );

            const adapterIncludes = [];
            const adapterModules = [];
            let webpackResolveAliases = '';
            let webpackModuleRules = '';
            const webpackResolveExtensions = [];
            const allDependencies = {
               dependencies: Object.assign( {}, dependencies ),
               devDependencies: Object.assign( {}, devDependencies )
            };
            const babelPlugins = JSON.parse( this.vars.babelPluginsString );
            this.selectedAdapters.forEach( _ => {
               Object.assign( allDependencies.dependencies, _.peerDependencies );
               Object.assign( allDependencies.devDependencies, _.devDependencies );

               if( !_.isBuiltIn ) {
                  const adapterModule = `${_.integrationTechnology}Adapter`;
                  const requireModule = `laxar-${_.integrationTechnology}-adapter`;
                  adapterIncludes.push( `import * as ${adapterModule} from '${requireModule}';`);
                  adapterModules.push( adapterModule );
               }

               if( _.babelPlugins && _.babelPlugins.length ) {
                  _.babelPlugins.forEach( p => babelPlugins.push( p ) );
               }

               if( _.webpackModuleRules && _.webpackModuleRules.length ) {
                  webpackModuleRules = _.webpackModuleRules.reduce( ( rules, rule ) => {
                     return `${rules},\n            ${rule}`;
                  }, webpackModuleRules );
               }
               if( _.webpackResolveAliases ) {
                  webpackResolveAliases = Object.keys( _.webpackResolveAliases )
                     .reduce( ( aliases, key ) => {
                        return `${aliases},\n            '${key}': '${_.webpackResolveAliases[ key ]}'`;
                     }, webpackResolveAliases );
                  Object.assign( webpackResolveAliases, _.webpackResolveAliases );
               }
               _.sourceFileExtensions.map( ext => `'${ext}'` ).forEach( ext => {
                  if( !webpackResolveExtensions.includes( ext ) ) {
                     webpackResolveExtensions.push( ext );
                  }
               } );
            } );
            this.vars.babelPluginsString = jsonList( babelPlugins );
            this.vars.dependenciesString = dependenciesForPackageJson( allDependencies.dependencies );
            this.vars.devDependenciesString = dependenciesForPackageJson( allDependencies.devDependencies );
            this.vars.adapterIncludes = adapterIncludes.join( '\n' );
            this.vars.adapterModules = `[ ${adapterModules.join( ', ' )} ]`;
            this.vars.webpackResolveAliases = webpackResolveAliases;
            this.vars.webpackModuleRules = webpackModuleRules;
            this.vars.webpackResolveExtensionsString = `[ ${webpackResolveExtensions.join( ', ' )} ]`;

            this.vars.cssClassName = this.vars.name.replace( /[_\s]+/, '-' );
            this.vars.banner = createBanner( this );
            this.vars.privateModule = this.vars.license === LICENSE_UNLICENSED ? '\n  "private": true,' : '';
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
      const binaryFilesToCopy = verbatimFileObject( [
         'favicon.ico'
      ] );
      const filesToCopy = verbatimFileObject( [
         'debug.html',
         'favicon.ico',
         'index.html',
         'init.js',
         'laxar.config.js',
         'package.json',
         'README.md',
         'webpack.config.js'
      ] );
      filesToCopy[ '_.babelrc' ] = '.babelrc';
      filesToCopy[ '_.gitignore' ] = '.gitignore';

      if( this.vars.exampleWidgets ) {
         filesToCopy[ 'demo.application/flows' ] = 'application/flows';
         filesToCopy[ 'demo.application/layouts' ] = 'application/layouts';
         filesToCopy[ 'demo.application/pages' ] = 'application/pages';
         this.selectedAdapters
            .map( _ => [
               `demo.application/widgets/example/${_.integrationTechnology}-hello-world-widget`,
               `application/widgets/example/${_.integrationTechnology}-hello-world-widget`
            ] )
            .forEach( ([ source, dest ]) => {
               filesToCopy[ source ] = dest;
            } );
         this.vars.contentAreaWidgets = jsonList( this.selectedAdapters.map(
            _ => ({ widget: `example/${_.integrationTechnology}-hello-world-widget` })
         ), 2 );
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
      Object.keys( binaryFilesToCopy ).forEach( sourceFile => {
         this.fs.copy(
            this.templatePath( sourceFile ),
            this.destinationPath( binaryFilesToCopy[ sourceFile ] )
         );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   end() {
      this.log( `
Now run ${bold.italic( 'npm install' )} to get tools and dependencies.
Then you can run ${bold.italic( 'npm start' )} to start the development server.
There, enter the application through the ${bold.italic( 'debug.html' )}.
The ${bold.italic( 'README.md' )} contains more information.

Have fun developing your LaxarJS application!

Also, please have a look at the manuals:
https://laxarjs.org/docs/laxar-v2-latest/manuals/`
      );
   }

};

function jsonList( entries, parentIndent = 1 ) {
   const spacePerIndent = 3;
   const nestedIndentation = new Array( (spacePerIndent * parentIndent) + 1 ).join( ' ' );

   return JSON.stringify( entries, null, spacePerIndent )
      .split( '\n' )
      .join( `\n${nestedIndentation}` );
}
