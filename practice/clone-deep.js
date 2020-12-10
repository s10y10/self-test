function cloneDeep(obj){
    let result = obj instanceof Array ? [] : {}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            result[key] = typeof obj[key] === 'object' ? cloneDeep(obj[key]) : obj[key]
        }
    }
    return result;
}

let a = {
    x:1,
    b:{
        y:3
    },
    c:[1,2,3]
}
let b = cloneDeep(a);
a.b.y = 4;
console.log(b);