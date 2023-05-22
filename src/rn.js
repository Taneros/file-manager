import fs from 'fs'; 
import path from 'path';

export const rn = ( homeDir, args ) => {

  const basePath = path.join( args[0] ).split( path.sep )
  
  basePath.pop()

  fs.rename( path.resolve( homeDir, args[0] ), path.resolve( homeDir, ...basePath, args[1] ), ( err ) => {
    if ( err ) {
      console.log( 'error rename', err )
    }
    console.log(`\nRenamed successfully!`)
  } )
}

