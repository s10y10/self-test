var a = [1,[2,3],[[4,5,[6]]]]

function flattenA(arr){
    if(arr.some(it => Array.isArray(it))){
        return flatten([].concat(...arr))
    }
    return arr;
}

function flattenB(arr){
    let result = []
    for(let i = 0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
            result = result.concat(flattenB(arr[i]))
        }else{
            result.push(arr[i])
        }
    }
    return result;
}

console.log(flattenB(a));