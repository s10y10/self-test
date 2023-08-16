function quickSort(arr){
    if(arr.length <= 1){
        return arr;
    }
    let mid = Math.floor(arr.length/2);
    let temp = arr.splice(mid,1);
    let len = arr.length;
    let left = [];
    let right = [];
    for(let i = 0;i<len;i++){
        if(arr[i] < temp){
            left.push(arr[i]);
        }else{
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(temp,quickSort(right))
}

console.log(quickSort([3,2,5,6,9,1,4]))