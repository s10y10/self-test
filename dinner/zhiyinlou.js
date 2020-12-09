const axios = require('axios')
const crypto = require('crypto')

const token = 'UG9VNEIwQThrdk1VUnVNcitTQlhNN1I4WHNQL3hORS93SGhBeWNpU1QrSldxL3RpTGVRVThYK016UDJYRkJaQw'
const secret = 'SEC794a0b4069f973d90d7437cd5544ecd1'

const toZhiYinLou = async function(url){
    let timestamp = +new Date()
    let sign = generateSign(timestamp)
    let postUrl = `https://yach-oapi.zhiyinlou.com/robot/send?access_token=${token}&timestamp=${timestamp}&sign=${sign}`
    let result = await axios.post(postUrl,{
        msgtype:"image",
        image:{ url },
    }).catch(err=>{
        console.log(err);
    })
    console.log(result.data);
}

const generateSign = (timestamp)=> {
    let str = `${timestamp}\n${secret}`
    let hash = crypto
      .createHmac('SHA256', secret)
      .update(str, 'utf8')
      .digest('base64')

    hash = encodeURIComponent(hash)
    return hash
  }

  module.exports = { toZhiYinLou }