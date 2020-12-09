const config = require('./config');
const puppeteer = require('puppeteer');
const { jietu } = require('./jietu')
const { toZhiYinLou } = require('./zhiyinlou')

let curUser = null;

puppeteer.launch({
  // headless: false,
  // devtools: true,
  ignoreHTTPSErrors:true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(async b => {
  browser = b;
  start();
})

async function start(){
  if(config.user.length === 0){
    browser.close();
    return;
  }

  page = await browser.newPage();
  await page.goto(config.url,{waitUntil:'networkidle2'});
  
  let cookies = await page.cookies();
  await page.deleteCookie(...cookies);
  await page.reload({waitUntil:'networkidle2'})

  const user = config.user.shift();
  curUser = user;

  await sleep(1000)

  const nameInput = await page.$('.field_1')
  await nameInput.type(user.name)
  await page.tap('.field_1')

  await sleep(1000)

  const workCode = await page.$('.field_2');
  await workCode.type(user.workCode);
  await page.tap('.field_2')

  await sleep(1000)

  await page.$$eval('.field_4 .ant-radio-wrapper', (nodes,group)=>{
    nodes.forEach(n => {
      if(n.innerHTML.includes(group)){
        n.click();
      }
    })
  },user.group)

  const types = await page.$$('.field_6 .ant-radio-wrapper');
  await types[user.type-1].click();

  page.on('response',resHandler);

  const submit = await page.$('.published-form__submit');
  await submit.click();
}


async function resHandler (res){
  let url = res.url();
  if(url.includes('code-verify.jinshujuapp.com/apps') && url.includes('serial_number')){
    let imageUrl = await jietu(page,url, curUser);
    await toZhiYinLou(imageUrl);
    start();
  }
}

function sleep (time){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    },time)
  })
}
