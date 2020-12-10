function add(a, b, c){
    return a + b + c;
}

function curry(fn){
    let arg = [...arguments].slice(1);
    let self = this;
    let len = fn.length;
    return function(){
        let newArg = arg.concat([...arguments]);
        if(newArg.length < len){
            return curry.call(self,fn,...newArg)
        }
        return fn.call(self,...newArg);
    }
}

var newAdd = curry(add);
console.log(newAdd(1)(2,3))
