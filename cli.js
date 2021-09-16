"use strict";

/* eslint no-process-exit: 0 */
/* eslint global-require: 0 */

const fs = require( "fs" );
const styleGenie = require( "." );

const respondToError = error => { if ( error ) { console.log( error ); return } };

const jsify = string => string.split( /\W/g ).map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) ).join( "" );

const printHelpMessage = () => {
  console.clear();
  console.log( [
    "yarn cli --w <filename>\t\tReads a file, parses it, and writes the result locally",
    "yarn cli --t <filename>\t\tReads a file, parses it, and logs the result in the console",
    "yarn cli --h\t\t\tPrints this help message"
  ].join( "\n\n" ) );
};

if ( require.main === module ) {
  let sliceN = 1;
  if ( process.argv.indexOf( module.filename ) > -1 || require( "path" ).basename( process.argv[ 1 ] ) === "parse-paths-from-svg" ) sliceN = 2;
  const args = process.argv.slice( sliceN, process.argv.length );
  switch ( args[ 0 ] ) {
    case "--w":
      fs.readFile( args[ 1 ], "utf8", ( error, file ) => {
        respondToError( error );
        const parsedFile = styleGenie.parse( file );
        const styledComponentsFromFile = Object.keys( parsedFile ).reduce( ( result, selector ) => [ ...result, `
export const ${ jsify( selector ) } = styled.div\`${ parsedFile[ selector ] }\`;
        ` ], [ 'import styled from "styled-components"\n' ] );
        fs.writeFile( `${ new Date().getTime() }-${ args[ 1 ].replace( /\.\w+$/g, "" ) }.js`, styledComponentsFromFile.join( "" ), respondToError );
      } );
      break;
    case "--t":
      fs.readFile( args[ 1 ], "utf8" , ( error, file ) => {
        respondToError( error );
        console.log( styleGenie.parse( file ) );
      } );
      break;
    case "--h":
      printHelpMessage();
      break;
    default:
      console.error( "Error" );
      process.exit( 1 );
  }
}
