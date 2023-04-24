import fs from 'fs';
import path from 'path';

export const mv = ( homeDir, args ) => {

  const fileName = path.basename( path.join( homeDir, args[0] ) )

  fs.mkdir( path.resolve( homeDir, args[1] ), {recursive: true}, ( err ) => {
    if ( err ) {
      console.log( 'Error creating new folder!' )
    }

    fs.createReadStream( path.resolve( homeDir, args[0] ) ).pipe( fs.createWriteStream( path.resolve( homeDir, args[1], fileName ) ) ).on( 'finish', () => {

      fs.unlink( path.join( homeDir, args[0] ), ( err ) => {
        if ( err ) {
          console.log( "\nCould not delete the file. " + err, + '\n' )
        }
      } );
      console.log( `\nMoving file done!\n` )
    } )
  } )

}


