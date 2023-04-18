import readline from 'readline';
import os from 'os'
import fs from 'fs';
import {stat} from 'fs/promises'
import path from 'path';
import {fileURLToPath} from 'url';

process.stdin.setEncoding('utf8')
// process.stdin.resume

const scriptPath=fileURLToPath(import.meta.url)

const dirName=path.dirname(scriptPath)

const pathToReadFile=path.join(dirName)

const homeDir=os.homedir()


const app=async () => {
  
  const args = process.argv.slice(2).toString().split('=')[1]
  
  console.log(`Welcome to the File Manager, ${args}!`)
  
  console.log(`You are currently in path_to_working_directory, ${homeDir}!`)

  console.log(`app.js - line: 28 ->> dirName`, dirName)

  process.stdin.on('data',(data) => {
    console.log(`app.js - line: 20 ->> data`,data.split('\n'))
    data = data.split('\n')[0]
    
    switch (data) {
      
      // case /ls/.test(data):
      case 'ls':
        
        fs.readdir(homeDir,(err,files) => {
          if(err) {
            console.log(`app.js - line: 26 ->> err ls`,err)
          }

          files=files.map(async (file,idx) => {
            
            const isDir = (await stat(homeDir)).isDirectory()

            return ({
              Name: file,
              Type: isDir ? 'directory' : 'file'
            })
          })

        })
        
        break;
    
      default:
        break;
    }
    

  })


}

await app()



