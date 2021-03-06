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
const controlDependencies = require( './dependencies.json' );
const technologies = require( '../../lib/technologies' );
const commonPrompts = require( '../../lib/common-prompts' );
const { LICENSE_UNLICENSED } = require( '../../lib/constants' );

module.exports = class extends Generator {

   constructor( args, opts ) {
      super( args, opts );
      this.argument( 'name', {
         type: String,
         required: false,
         desc: 'Name of the artifact'
      } );
      this.option( 'banner', {
         type: String,
         defaults: '',
         desc: 'Path to a file with a banner'
      } );
      this.option( 'directory', {
         type: String,
         defaults: '',
         desc: 'Base directory for controls'
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   initializing() {
      const controlName = determineArtifactName( this );
      this.controlDirname = determineArtifactDirName( this, 'controls' );

      this.vars = {
         name: controlName,
         angularDirectiveName: '',
         description: '',
         license: this.config.get( 'license' ),
         privateModule: '',
         homepage: this.config.get( 'homepage' ),
         author: this.config.get( 'author' ),
         integrationTechnology: this.config.get( 'laxarIntegrationTechnology' ) || 'plain',
         cssClassName: '',
         banner: getBanner( this )
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   prompting() {
      commonPrompts.greetings( this, 'control' );

      const prompts = [
         ...commonPrompts.prompts( 'control', this.vars ),
         {
            type: 'list',
            name: 'integrationTechnology',
            message: 'Integration technology:',
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

            if( typeof this.technology.addAdditionalControlVars === 'function' ) {
               this.technology.addAdditionalControlVars( this.vars );
            }
            const ext = sourceFileExtensions( this.technology )[ 0 ];
            this.vars.controlFileName = `${this.vars.name}${ext}`;

            const allDependencies = {
               dependencies: Object.assign( {}, controlDependencies.dependencies ),
               peerDependencies: Object.assign( {}, controlDependencies.peerDependencies ),
               devDependencies: Object.assign( {}, controlDependencies.devDependencies )
            };

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
      const filesToCopy = verbatimFileObject( [ 'control.json' ] );
      Object.assign( filesToCopy, {
         'default.theme/css/control.css': `default.theme/css/${name}.css`
      }, this._filesForTechnology() );

      if( this.vars.infrastructure ) {
         Object.assign( filesToCopy, {
            '_.gitignore': '.gitignore'
         } );
         Object.assign( filesToCopy, verbatimFileObject( [
            'README.md',
            'package.json'
         ] ) );
      }

      Object.keys( filesToCopy ).forEach( sourceFile => {
         const destinationFile = path.join( this.controlDirname, name, filesToCopy[ sourceFile ] );
         this.fs.copyTpl(
            this.templatePath( sourceFile ),
            this.destinationPath( destinationFile ),
            this.vars
         );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   _filesForTechnology() {
      const { controlFileName, infrastructure, integrationTechnology } = this.vars;
      const ext = sourceFileExtensions( this.technology )[ 0 ];
      const files = {
         [ `${integrationTechnology}.control${ext}` ]: controlFileName
      };

      if( typeof this.technology.additionalControlFilesToCopy === 'function' ) {
         Object.assign( files, this.technology.additionalControlFilesToCopy( this.vars ) );
      }

      if( infrastructure ) {
         const sourceFile =
            this.fs.exists( this.templatePath( `${integrationTechnology}.webpack.config.js` ) ) ?
            `${integrationTechnology}.webpack.config.js` : 'webpack.config.js';
         files[ sourceFile ] = 'webpack.config.js';
      }

      return files;
   }

};
