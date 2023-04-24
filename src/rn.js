import fs from 'fs'; 
import path from 'path';

export const rn = ( homeDir, args ) => {

  fs.rename( path.resolve( homeDir, args[0] ), path.resolve( homeDir, args[1] ), ( err ) => {
    if ( err ) {
      console.log( 'error rename', err )
    }
    console.log(`\nRenamed successfully!`)
  } )
}

