/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

function greetings( generator, artifact ) {
   generator.log( `
LaxarJS ${artifact} generator v${generator.rootGeneratorVersion()}.

This generator will create the basic file- and directory structure of a LaxarJS ${artifact}.
For more information about LaxarJS artifacts, please see the docs at
https://laxarjs.org/docs/laxar-v2-latest/concepts/`
   );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prompts( artifactType, defaults ) {
   return [
      {
         type: 'input',
         name: 'name',
         message: `The ${artifactType} name:`,
         default: defaults.name,
         validate: _ => _ ? true : 'Please insert a name.'
      }, {
         type: 'input',
         name: 'description',
         message: 'Description (optional):',
         default: defaults.description
      }, {
         type: 'input',
         name: 'license',
         message: 'License:',
         default: defaults.license,
         filter: _ => ( _ === 'none' || _ === '' ) ? 'none' : _,
         validate( input ) {
            const message =
               'Must be one license or "none". ' +
               'Complex license expressions have to be configured subsequently by hand.';
            return typeof input === 'string' || message;
         }
      }, {
         type: 'input',
         name: 'homepage',
         message: 'Project homepage (optional):',
         default: defaults.homepage
      }, {
         type: 'input',
         name: 'author',
         message: 'Author name (optional):',
         default: defaults.author
      }
   ];
}

module.exports = { greetings, prompts };
