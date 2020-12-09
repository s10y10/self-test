function fibo(n) {
    return n == 0 ? 0 : n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

function a(n){
    return new Promise((resolve)=>{
        let result = fibo(n);
        resolve(result);
    })
}

async function exuteFiboSingle(){
    var collection = [40, 41, 41, 39,
        40, 41, 41, 39,
        40, 41, 41, 39,
        40, 41, 41, 39,
        40, 41, 41, 39]
    var pl = collection.map(n=>{
        return a(n);
    })
    await Promise.all(pl);
}

module.exports = exuteFiboSingle