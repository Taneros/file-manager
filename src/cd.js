import path from 'path';

export const cd = (homeDir, args) => {

  const changeDir = path.join( homeDir, args[0] )

  console.log( '\nCurrent directory is ', changeDir, '\n' )

  return changeDir
}