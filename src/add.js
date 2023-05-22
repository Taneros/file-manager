import fs from 'fs'; 
import path from 'path';

export const add = ( homeDir, args ) => {

  const ws = fs.createWriteStream( path.resolve( homeDir, args[0] ) )
  ws.end( () => console.log('\nAdded file successfully!\n'))
}

