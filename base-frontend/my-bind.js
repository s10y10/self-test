Function.prototype.myBind = function(context){
    if(typeof this !== 'function'){
        throw new TypeError('type error')
    }
    let self = this;
    let arg = [...arguments].slice(1);
    return function(){
        return self.apply(context,arg.concat(...arguments))
    }
}