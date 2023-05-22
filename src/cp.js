import fs from 'fs';
import path from 'path';

export const cp = ( homeDir, args ) => {

  const fileName = path.basename( path.join( homeDir, args[0] ) )

  fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
    if ( err ) {
      console.log( 'Error creating new folder!' )
    }

    fs.createReadStream( path.join( homeDir, args[0] ) ).pipe( fs.createWriteStream( path.join( homeDir, args[1], fileName ) ) ).on( 'finish', () => {
      console.log( `\nCopying file done!\n` )
    } )
  } )
}



