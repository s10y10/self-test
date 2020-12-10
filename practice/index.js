require('./my-call')
require('./my-apply')
require('./my-bind')
const MyPromise = require('./my-promise')
const cloneDeep = require('./clone-deep')
const EventBus = require('./event-bus');
require('./data-bind')

let p = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        console.log(5);
        resolve();
    },2000)
})
p.then(()=>{
    console.log(3);
})

// function aaa (a,b){
//     return 1 + a + b;
// }

// let b = aaa.myBind(this,2);
// console.log(b(3))

// let a = {b:1,c:[1,2],d:{f:5}}
// let g = cloneDeep(a);
// console.log(g);

// function d(t){
//     console.log(t + 1)
// }

// EventBus.on('aaa',d);
// EventBus.off('aaa')
// EventBus.emit('aaa',2)
