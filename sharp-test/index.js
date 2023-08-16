const sharp = require('sharp');



const start = async ()=>{
    return new Promise(resolve=>{
        const img = sharp('test.gif',{ animated: true });
        img.metadata()
        .then((metadata)=>{
            img.webp({
                quality:20
            })
            .toFile('output.webp', function(err) {
                console.log(err);
                resolve();
            });
        })
    });
}

async function aaa (){
    await start();
    console.log(1);
}

aaa();