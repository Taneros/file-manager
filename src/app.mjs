import crypto from 'crypto';
import fs from 'fs';
import {arch, cpus, EOL, homedir, userInfo} from 'os';
import path from 'path';
import {pipeline} from 'stream';
import zlib from 'zlib';

import {up} from './up.js'
import {cd} from './cd.js';
import {ls} from './ls.js';
import {cat} from './cat.js';
import {add} from './add.js';
import {rn} from './rn.js';
import {cp} from './cp.js';
import {mv} from './mv.js';


process.stdin.setEncoding( 'utf8' )

let homeDir = homedir()

const app = async () => {

  const user = process.argv.slice( 2 ).toString().split( '=' )[1]

  console.log( `Welcome to the File Manager, ${ user }!\n` )

  console.log( `You are currently in path_to_working_directory, ${ homeDir }\n` )


  process.stdin.on( 'data', ( data ) => {

    const [command, ...args] = data.trim().split( ' ' )

    switch ( command ) {

      case 'up':

        homeDir = up( homeDir )

        break;

      case 'cd':

        homeDir = cd( homeDir, args )

        break;

      case 'ls':

        ls( homeDir )

        break;

      case 'cat':

        cat( homeDir, args )

        break;

      case 'add':

        add( homeDir, args )

        break;

      case 'rn':

        rn( homeDir, args )

        break;

      case 'cp':

        cp( homeDir, args )
        break;

      case 'mv':

        mv( homeDir, args )

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

        const readFileHashStream = fs.createReadStream( path.join( homeDir, args[0] ) )
        const hash = crypto.createHash( 'sha256' )

        readFileHashStream.on( 'data', ( data ) => {
          hash.update( data )

        } )

        readFileHashStream.on( 'end', () => {
          console.log( '\nSHA256: ', hash.digest( 'hex' ) );
        } )

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
            if ( err ) console.log( `\nError compressing!\n`, err )
          } ).on( 'finish', () => {console.log( `\nCompressed successfully!\n`, )} )
        } )

        break;

      case 'decompress':

        const decompressedFileName = path.basename( path.join( homeDir, args[0] ) ).split( '.br' )[0]

        fs.mkdir( path.join( homeDir, args[1] ), {recursive: true}, ( err ) => {
          if ( err ) {
            console.log( 'Error creating new folder!' )
          }

          const readFileToCompress = fs.createReadStream( path.join( homeDir, args[0] ) )
          const writeCompressedFile = fs.createWriteStream( path.join( homeDir, args[1], decompressedFileName ) )

          const brotliDecompress = zlib.createBrotliDecompress();

          pipeline( readFileToCompress, brotliDecompress, writeCompressedFile, ( err ) => {
            if ( err ) console.log( `\nError decompressing!\n`, err )
          } ).on( 'finish', () => {console.log( `\nDecompressed successfully!\n`, )} )
        } )

        break;

      case '.exit':

        console.log( `\nThank you for using File Manager, ${ user }, goodbye!` );

        process.exit( 0 )

        break;

      default:
        break;
    }
  } )

  process.on( 'SIGINT', () => {

    console.log( `\nThank you for using File Manager, ${ user }, goodbye!` );

    process.exit( 0 )
  } )
}

await app()