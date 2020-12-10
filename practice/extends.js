function Parent(p){
    this.name = 'parent'
    this.tag = p
}

function Child(){
    Parent.call(this,'c')
    this.name = 'child'
}

Child.prototype = new Parent();

var c = new Child('c');
console.log(c.tag);
