let obj = {}
Object.defineProperty(obj,'b',{
    set:function(value){
        c = value;
    }
})