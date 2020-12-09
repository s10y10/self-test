const { putFile } = require('./oss')

const jietu = async function(page, url, user){
    await page.goto(url,{waitUntil:'load'});
    await page.$eval('.code-description',(el,user)=>{
      let nextDate = new Date(Date.now() + 86400000)
      el.innerHTML = `${user.name} ${nextDate.getMonth()+1}月${nextDate.getDate()}日`
    },user)
    const codeInfo = await page.$('.code-info');
    await page.setViewport({
        width:800,
        height:600,
        deviceScaleFactor:2
    })
    let jietu = await codeInfo.screenshot({
      encoding:'base64',
    })
    let jietuSource = `data:image/png;base64,${jietu}`
    let file = dataURLToFile(jietuSource,'jietu.png')
    let result = await putFile(file,'jietu')
    return result;
}

const dataURLToFile = function(urlData, fileName){
    let base64Data = urlData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    return dataBuffer
}

module.exports = {
    jietu
}