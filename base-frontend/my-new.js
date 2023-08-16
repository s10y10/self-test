function myNew(fn){
    return function(){
        let obj = {
            __proto__:fn.protoType
        }
        fn.call(obj,...arguments)
        return obj;
    }
}

function Person(name){
    this.name = name;
}

var p = myNew(Person)('a')
console.log(p.name);