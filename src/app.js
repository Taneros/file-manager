import readline from 'readline';
import os, {homedir} from 'os'
import fs from 'fs';
import {stat, opendir} from 'fs/promises'
import path from 'path';
import {fileURLToPath} from 'url';

process.stdin.setEncoding('utf8')
process.stdin.resume

// const scriptPath=fileURLToPath(import.meta.url)

// const dirName=path.dirname(scriptPath)

// const pathToReadFile=path.join(dirName)

let homeDir=os.homedir()


const app=async () => {
  
  const args=process.argv.slice(2).toString().split('=')[1]
  
  console.log(`app.js - line: 24 ->>  process.argv`,  process.argv)
  
  console.log(`Welcome to the File Manager, ${args}!\n`)
  
  console.log(`You are currently in path_to_working_directory, ${homeDir}\n`)

  // console.log(`app.js - line: 28 ->> dirName`, dirName)



  process.stdin.on('data',(data) => {

    // console.log(`app.js - line: 34 ->> data.trim().split(' ')`,data.trim().split(' '))
    

    
    console.log(`app.js - line: 20 ->> data`,data.split(' '))
    
    
    // const command = data.trim().split(' ') // ['']
    
    const [command,...args]=data.trim().split(' ')
    


    
    switch (command) {
    

      case 'up':
      
        let oneStepBack=path.join(homeDir,'../')

        homeDir = oneStepBack
        
        console.log(oneStepBack)
        
      break;

      case 'ls':

        //TODO 
        /**
          * sort by direcotry and name and file and name
          **/
        
        fs.readdir(homeDir,{withFileTypes: true}, (err, files) => {
          if(err) {
            console.log(`app.js - line: 26 ->> err ls`,err)
          }          

          files = files.map((file) => ({
            Name: file.name,
            Type: file.isDirectory() ? 'directory' : 'file'
          }))
          
          console.table(files)
        })

        
        break;
      
      case 'cat':
        console.log(`app.js - line: 86 ->> cat`, command, args)
        
        fs.createReadStream(path.resolve(homeDir, args[0])).pipe(process.stdout)

        
        break;
      
      case 'add':

        console.log(`app.js - line: 88 ->> add`,)

        fs.createWriteStream(path.resolve(homeDir,args[0]))
        
        
        break;
      
      case 'rn':

        console.log(`app.js - line: 102 ->> args[0] args[1]`, args[0].trim(), args[1].trim() )

        fs.rename(path.resolve(homeDir,args[0]), path.resolve(homeDir,args[1]), (err) => {
          if(err) {
            console.log(`app.js - line: 104 ->> error rename`)
          }
        })
        
        break;
      
      case 'cp':

        

      fs.mkdirSync(path.dirname(path.resolve(homeDir, args[1])));

        
        
      fs.createReadStream(path.resolve(homeDir,args[0])).pipe(fs.createWriteStream(path.resolve(homeDir,args[1]))).on('finish', () => {console.log(`app.js - line: 115 ->> copy done!`, )})
        
        break;
      
    
      default:
        break;
    }
    

  })


}

await app()





