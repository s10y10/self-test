function add(){
    let arg = [...arguments].slice()
    let _add = function(){
        arg.push(...arguments);
        return _add
    }

    _add.sum = function(){
        console.log(arg);
        return arg.reduce(function(preValue,curValue){
            return preValue + curValue
        },0)
    }
    return _add;
}

console.log(add(1)(2).sum());