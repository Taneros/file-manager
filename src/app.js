import readline from 'readline';

process.stdin.setEncoding('utf8')
process.stdin.resume

import os from 'os'
import fs from 'fs';

const homeDir=os.homedir()

const app = async ( ) => {
  
  const args = process.argv.slice(2).toString().split('=')[1]
  
  console.log(`Welcome to the File Manager, ${args}!`)
  
  console.log(`You are currently in path_to_working_directory, ${homeDir}!`)

  process.stdin.on('data',(data) => {
    console.log(`app.js - line: 20 ->> data`, data)
    
    switch (data) {
      case 'ls':
        
        fs.readdir(homeDir,(err, files) => {
          if(err) {
            console.log(`app.js - line: 26 ->> err ls`, err)
          }

          files.forEach(element => {
            console.log(`app.js - line: 30 ->> file`, element)
          });
        })
        
        break;
    
      default:
        break;
    }
    

  })


}

await app()



