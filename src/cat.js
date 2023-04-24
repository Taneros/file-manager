import fs from 'fs'; 
import path from 'path';

export const cat = ( homeDir, args ) => {

  fs.createReadStream( path.resolve( homeDir, args[0] ) ).pipe( process.stdout )

}

