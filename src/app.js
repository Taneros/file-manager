import readline from 'readline';
import fs from 'fs';
import {stat, opendir} from 'fs/promises'
import path from 'path';
import {fileURLToPath} from 'url';
import {EOL, cpus, homedir, userInfo, arch} from 'os';
import crypto from 'crypto'
import {pipeline} from 'stream';
import zlib from 'zlib';


process.stdin.setEncoding( 'utf8' )
process.stdin.resume

// const scriptPath=fileURLToPath(import.meta.url)

// const dirName=path.dirname(scriptPath)

// const pathToReadFile=path.join(dirName)

let homeDir = homedir()

const app = async () => {

  const args = process.argv.slice( 2 ).toString().split( '=' )[1]

  console.log( `app.js - line: 24 ->>  process.argv`, process.argv )

  console.log( `Welcome to the File Manager, ${ args }!\n` )

  console.log( `You are currently in path_to_working_directory, ${ homeDir }\n` )

  // console.log(`app.js - line: 28 ->> dirName`, dirName)

  process.stdin.on( 'data', ( data ) => {

    // console.log(`app.js - line: 34 ->> data.trim().split(' ')`,data.trim().split(' '))

    console.log( `app.js - line: 20 ->> data`, data.split( ' ' ) )

    // const command = data.trim().split(' ') // ['']

    const [command, ...args] = data.trim().split( ' ' )

    console.log( `app.js - line: 47 ->> command, args`, command, args )

    switch ( command ) {

      case 'up':

        let oneStepBack = path.join( homeDir, '../' )

        homeDir = oneStepBack

        console.log( '\nCurrent directory is ', homeDir, '\n' )

        break;

      case 'cd':

        let changeDir = path.join( homeDir, args[0] )

        homeDir = changeDir

        console.log( '\nCurrent directory is ', homeDir, '\n' )
        break;

      case 'ls':

        //TODO 
        /**
          * sort by direcotry and name and file and name
          **/

        fs.readdir( homeDir, {withFileTypes: true}, ( err, files ) => {
          if ( err ) {
            console.log( `app.js - line: 26 ->> err ls`, err )
          }

          files = files.map( ( file ) => ( {
            Name: file.name,
            Type: file.isDirectory() ? 'directory' : 'file'
          } ) )

          console.table( files )
        } )

        break;

      case 'cat':

        fs.createReadStream( path.resolve( homeDir, args[0] ) ).pipe( process.stdout )

        break;

      case 'add':

        fs.createWriteStream( path.resolve( homeDir, args[0] ) )

        break;

      case 'rn':

        fs.rename( path.resolve( homeDir, args[0] ), path.resolve( homeDir, args[1] ), ( err ) => {
          if ( err ) {
            console.log( `app.js - line: 104 ->> error rename` )
          }
        } )

        break;

      case 'cp':

        fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
          if ( err ) {
            console.log( 'Error creating new folder!' )
          }

          fs.createReadStream( path.join( homeDir, args[0] ) ).pipe( fs.createWriteStream( path.join( homeDir, args[1], args[0] ) ) ).on( 'finish', () => {
            console.log( `\nCopying file done!\n` )
          } )
        } )
        break;

      case 'mv':

        fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
          if ( err ) {
            console.log( 'Error creating new folder!' )
          }

          fs.createReadStream( path.join( homeDir, args[0] ) ).pipe( fs.createWriteStream( path.join( homeDir, args[1], args[0] ) ) ).on( 'finish', () => {

            fs.unlink( path.join( homeDir, args[0] ), ( err ) => {
              if ( err ) {
                console.log( "\nCould not delete the file. " + err, + '\n' )
              }
            } );
            console.log( `\nMoving file done!\n` )
          } )
        } )

        break;

      case 'os':

        switch ( true ) {

          case /EOL/.test( args[0] ):

            console.log( '\nSystem EOL: ', JSON.stringify( EOL ) )

            break;

          case /cpus/.test( args[0] ):

            console.log( '\nCPU Model: ', cpus()[0].model )
            console.log( '\nNumber of cores: ', cpus().length )

            const cpusInfo = cpus().map( ( cpu ) => ( {Clock_GHz: ( cpu.speed / 1000 ).toFixed( 2 )} ) )

            console.table( cpusInfo )

            break;

          case /homedir/.test( args[0] ):

            console.log( 'Home directory: ', homedir() )

            break;

          case /username/.test( args[0] ):

            console.log( 'System user name: ', userInfo().username )

            break;

          case /arch/.test( args[0] ):

            console.log( 'CPU architecture: ', process.env['PROCESSOR_ARCHITECTURE'], `(${ arch() })` )

            break;

          default:
            break;
        }

        break;
      
      
      case 'hash':

      const readFileHashStream =  fs.createReadStream(path.join( homeDir, args[0] ))
      const hash = crypto.createHash( 'sha256' )

        readFileHashStream.on( 'data', ( data ) => {
          hash.update( data )
          
        } )

        readFileHashStream.on( 'end', () => {
          console.log('\nSHA256: ', hash.digest('hex'));
        })
        
        break;
      
      
      case 'compress':

      fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
        if ( err ) {
          console.log( 'Error creating new folder!' )
        }
          
        const readFileToCompress = fs.createReadStream( path.join( homeDir, args[0] ) )
        const writeCompressedFile = fs.createWriteStream( path.join( homeDir, args[1], `${ args[0] }.br` ) )
        
        const brotliCompress = zlib.createBrotliCompress();

        pipeline( readFileToCompress, brotliCompress, writeCompressedFile, ( err ) => {
          if(err) console.log(`\nError compressing!\n`,err )
        }).on('finish', () => {console.log(`\nCompressed successfully!\n`, )})
      } )
        
        break;
      
      case 'decompress':

      const decompressedFileName = path.basename(path.join( homeDir, args[0] )   ).split('.br')[0]
        
      fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
        if ( err ) {
          console.log( 'Error creating new folder!' )
        }
          
        const readFileToCompress = fs.createReadStream( path.join( homeDir, args[0] ) )
        const writeCompressedFile = fs.createWriteStream( path.join( homeDir, args[1], decompressedFileName  ) )
        
        const brotliDecompress = zlib.createBrotliDecompress();

        pipeline( readFileToCompress, brotliDecompress, writeCompressedFile, ( err ) => {
          if(err) console.log(`\nError decompressing!\n`,err )
        }).on('finish', () => {console.log(`\nDecompressed successfully!\n`, )})
      } )
        
        break;

      default:
        break;
    }
  } )
}

await app()



// normalize

// let newPath = path.resolve(homeDir,args[1])

// newPath=newPath.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g,'')
