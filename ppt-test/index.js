const fs = require('fs')
// const path = require('path')
// const childProcess = require('child_process')
// const fileName = './test.pptx'
// const tempDirName = 'a';

const SDK = require('pptx-parse');
const sdk = new SDK();
sdk.parsePPT('test2.pptx','./abcd').then(()=>{
    fs.writeFileSync('./test2.json',JSON.stringify(sdk.json))
})

const runParse = ()=>{
    childProcess.exec('unzip ' + fileName + ' -d ' + tempDirName,()=>{
        readUnzipFile();
    })
}


const readUnzipFile = ()=>{
    
}

// runParse();
