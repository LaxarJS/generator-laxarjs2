/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const path = require( 'path' );
const Generator = require( 'yeoman-generator' );
const {
   getBanner,
   createBanner,
   determineArtifactDirName,
   determineArtifactName,
   dependenciesForPackageJson,
   sourceFileExtensions,
   verbatimFileObject
} = require( '../../lib/utils' );
const { common, widget } = require( './dependencies.json' );
const technologies = require( '../../lib/technologies' );
const commonPrompts = require( '../../lib/common-prompts' );
const { LICENSE_UNLICENSED } = require( '../../lib/constants' );

module.exports = class extends Generator {

   constructor( args, opts ) {
      super( args, opts );
      this.argument( 'name', {
         type: String,
         required: false,
         desc: 'Name of the widget or activity'
      } );
      this.option( 'activity', {
         type: Boolean,
         defaults: false,
         desc: 'Create an activity instead of a widget'
      } );
      this.option( 'directory', {
         type: String,
         defaults: '',
         desc: 'Base directory for widgets'
      } );
      this.option( 'banner', {
         type: String,
         defaults: '',
         desc: 'Path to a text file whose contents are prepended as (license) header to source files'
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   initializing() {
      this.isWidget = !this.options.activity;
      this.widgetDirname = determineArtifactDirName( this, 'widgets' );

      const widgetName = determineArtifactName( this );
      this.vars = {
         name: widgetName,
         description: '',
         license: this.config.get( 'license' ),
         privateModule: '',
         homepage: this.config.get( 'homepage' ),
         author: this.config.get( 'author' ),
         integrationTechnology: ( this.isWidget && this.config.get( 'integrationTechnology' ) ) || 'plain',
         integrationType: this.options.activity ? 'activity' : 'widget',
         cssClassName: '',
         banner: getBanner( this ),
         path: widgetName
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   prompting() {
      commonPrompts.greetings( this, this.vars.integrationType );

      const activityNote = this.isWidget ? '' :
         ' (Note: when creating an activity using "plain" is encouraged)';

      const prompts = [
         ...commonPrompts.prompts( this.vars.integrationType, this.vars ),
         {
            type: 'list',
            name: 'integrationTechnology',
            message: `Integration technology${activityNote}:`,
            choices: technologies.map( _ => ({
               name: `${_.name} ("${_.integrationTechnology}")`,
               value: `${_.integrationTechnology}`
            }) ),
            default: this.vars.integrationTechnology
         },
         {
            type: 'confirm',
            name: 'infrastructure',
            message: 'Create project infrastructure (README.md, package.json, webpack.config.js)?',
            default: false
         }
      ];

      return this.prompt( prompts )
         .then( answers => {
            Object.assign( this.vars, answers );

            this.vars.cssClassName = this.vars.name.replace( /[_\s]+/, '-' );
            this.vars.banner = createBanner( this );
            this.vars.privateModule = this.vars.license === LICENSE_UNLICENSED ? '\n  "private": true,' : '';

            this.technology =
               technologies.find( _ => _.integrationTechnology === this.vars.integrationTechnology );

            if( typeof this.technology.addAdditionalWidgetVars === 'function' ) {
               this.technology.addAdditionalWidgetVars( this.vars );
            }
            const ext = sourceFileExtensions( this.technology )[ 0 ];
            this.vars.controllerName = `${this.vars.name}${ext}`;

            const allDependencies = {
               dependencies: Object.assign( {}, common.dependencies ),
               peerDependencies: Object.assign( {}, common.peerDependencies ),
               devDependencies: Object.assign( {}, common.devDependencies )
            };
            if( this.isWidget ) {
               Object.keys( allDependencies )
                  .forEach( _ => { Object.assign( allDependencies[ _ ], widget[ _ ] ); } );
            }

            Object.assign( allDependencies.peerDependencies, this.technology.peerDependencies );
            Object.assign( allDependencies.devDependencies, this.technology.devDependencies );

            [ 'dependencies', 'peerDependencies', 'devDependencies' ].forEach( _ => {
               this.vars[ `${_}String` ] = dependenciesForPackageJson( allDependencies[ _ ] );
            } );
         } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   configuring() {
      this.config.set( {
         author: this.vars.author,
         homepage: this.vars.homepage,
         license: this.vars.license,
         infrastructure: this.vars.infrastructure,
         integrationTechnology: this.vars.integrationTechnology,
         banner: this.vars.banner
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   writing() {
      const { name } = this.vars;
      const filesToCopy = verbatimFileObject( [ 'widget.json' ] );
      Object.assign( filesToCopy, {
         '_.gitignore': '.gitignore',
         'spec/widget.spec.js': `spec/${name}.spec.js`
      }, this._filesForTechnology() );

      if( this.isWidget ) {
         filesToCopy[ 'default.theme/css/widget.css' ] = `default.theme/css/${name}.css`;
      }

      if( this.vars.infrastructure ) {
         Object.assign( filesToCopy, verbatimFileObject( [
            'README.md',
            'package.json'
         ] ) );
      }

      Object.keys( filesToCopy ).forEach( sourceFile => {
         const destinationFile = path.join( this.widgetDirname, name, filesToCopy[ sourceFile ] );
         this.fs.copyTpl(
            this.templatePath( sourceFile ),
            this.destinationPath( destinationFile ),
            this.vars
         );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   _filesForTechnology() {
      const { controllerName, infrastructure, integrationTechnology, integrationType, name } = this.vars;
      const ext = sourceFileExtensions( this.technology )[ 0 ];
      const files = {
         [ `${integrationTechnology}.${integrationType}.controller${ext}` ]: controllerName
      };

      if( typeof this.technology.additionalWidgetFilesToCopy === 'function' ) {
         Object.assign( files, this.technology.additionalWidgetFilesToCopy( this.vars ) );
      }

      if( infrastructure ) {
         const sourceFile =
            this.fs.exists( this.templatePath( `${integrationTechnology}.webpack.config.js` ) ) ?
            `${integrationTechnology}.webpack.config.js` : 'webpack.config.js';
         files[ sourceFile ] = 'webpack.config.js';
      }

      if( this.isWidget && this.technology.hasExternalTemplate !== false ) {
         files[ 'default.theme/widget.html' ] = `default.theme/${name}.html`;
      }
      return files;
   }

};
