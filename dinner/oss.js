const OSS = require('ali-oss')

const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    secure:true,
    timeout:180 * 1000,
    internal:false
})

const putFile = async function (file,name) {
    return new Promise((resolve, reject) => {
        let ossTargetPath = `dinner/${name}-${Date.now()}.png`;
        client.put(ossTargetPath, file).then(function (result) {
            resolve(result.url);
        }).catch(function (err) {
            console.error('error: %j', err);
            reject(err);
        });
    })
}

module.exports = {
    putFile
}