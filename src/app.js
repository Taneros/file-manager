import readline from 'readline';

process.stdin.setEncoding('utf8')
process.stdin.resume

import os from 'os'

const homeDir=os.homedir()

console.log(`app.js - line: 10 ->> homeDir`, homeDir)

const app = async ( ) => {
  
  console.log(process.argv)

  process.stdin.on('data',(data) => {
    
    console.log(data)
    
    // readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout
  
    // })
    

  })


}

await app()



