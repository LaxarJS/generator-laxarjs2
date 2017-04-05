/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const path = require( 'path' );

function getBanner( generator ) {
   const bannerFilePath = generator.options.banner;

   if( bannerFilePath && typeof bannerFilePath === 'string' ) {
      let banner;
      try {
         banner = generator.fs.read( bannerFilePath );
      }
      catch( e ) {
         generator.env.error( `Could not open file "${bannerFilePath}" for custom banner.`);
      }

      if( typeof banner === 'string' ) {
         return banner.trim();
      }
   }
   return generator.config.get( 'banner' );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createBanner( generator ) {
   const { vars } = generator;

   if( vars.banner ) {
      return vars.banner;
   }

   const author = vars.author ? ` ${vars.author}` : '';
   return '/**\n * ' + [
      `Copyright ${new Date().getFullYear()}${author}`,
      ( vars.license && vars.license !== 'none' ) ? `Released under the ${vars.license} license` : null,
      vars.homepage
   ].filter( _ => _ ).join( '\n * ' ) + '\n */';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function determineArtifactDirName( generator, defaultPath ) {
   if( generator.options.directory ) {
      return generator.options.directory;
   }
   if( generator.options.name ) {
      return defaultPath;
   }
   if( generator.env.cwd !== generator.destinationRoot() ) {
      return path.dirname( path.relative( generator.destinationRoot(), generator.env.cwd ) );
   }
   return defaultPath;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function determineArtifactName( generator ) {
   if( generator.options.name ) {
      return generator.options.name;
   }
   if( generator.env.cwd !== generator.destinationRoot() && generator.options.directory.length === 0) {
      return path.basename( path.relative( generator.destinationRoot(), generator.env.cwd ) );
   }
   return '';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dependenciesForPackageJson( dependencies ) {
   return '{\n    ' +
      Object.keys( dependencies )
         .sort()
         .map( dependency => `"${dependency}": "${dependencies[ dependency ]}"` )
         .join( ',\n    ') +
      '\n  }';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sourceFileExtensions( technology ) {
   const extensions = technology.sourceFileExtensions || [];
   if( !extensions.includes( '.js' ) ) {
      extensions.push( '.js' );
   }
   return extensions;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function verbatimFileObject( fileArray ) {
   return fileArray.reduce( ( obj, file ) => Object.assign( {}, obj, { [ file ]: file } ), {} );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
   getBanner,
   createBanner,
   determineArtifactDirName,
   determineArtifactName,
   dependenciesForPackageJson,
   sourceFileExtensions,
   verbatimFileObject
};
