import fs from 'fs';

export const ls = ( homeDir ) => {

  fs.readdir( homeDir, {withFileTypes: true}, ( err, files ) => {
    if ( err ) {
      console.log( err )
    }

    const directoriesList = files.filter( file => file.isDirectory() ).sort( ( a, b ) => a.name - b.name );
    const filesList = files.filter( file => !file.isDirectory() ).sort( ( a, b ) => a.name - b.name );

    const sortedDirList = [...directoriesList, ...filesList].map( ( file ) => ( {
      Name: file.name,
      Type: file.isDirectory() ? 'directory' : 'file'
    } ) )

    console.table( sortedDirList )
  } )

}
