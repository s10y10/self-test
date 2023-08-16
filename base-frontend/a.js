// let str = 'bacdccbdb58575'


function sort(str){
    let r = str.split('')
    let obj = {}
    for(let i = 0;i<r.length;i++){
        if(!obj[r[i]]){
            obj[r[i]] = 1
        }else{
            obj[r[i]]++;
        }
    }
    
    let maxNumber = 0;
    let maxWord = 0;
    for(let key in obj){
        if(maxNumber < obj[key]){
            if(isNaN(key)){
                maxWord = key;
            }else{
                maxNumber = key;
            }
        }
    }
    return [maxWord,maxNumber]
}


// console.log(obj);

function foo(){
    for(var i = 1;i<=500;i++){
        setTimeout((function(i){
            return function(){
                console.log(i)
            }
        })(i),i*1000)
    }
}

function format(str,obj){
    for(let key in obj){
        let reg = new RegExp(`{${key}}`,'g')
        str = str.replace(reg,decodeURIComponent(obj[key]))
    }
    return str;
}

let s = 'a{b}a';
let o = {
    b:'c'
}
console.log(format(s,o))

class List{
    constructor(){
        this.arg = [];
        this.add(...arguments);
    }

    get length(){
        return this.arg.length;
    }

    add(){
        this.arg.push(...arguments)
    }

    all(){
        return this.arg;
    }
}

let ul = document.getElementById('list');
let docF = document.createDocumentFragment();
for(let i = 0;i<10000;i++){
    let li = document.createElement('li');
    li.dataset('item_index',0);
    docF.appendChild(li);
}
ul.appendChild(docF);
ul.addEventListener('click',function(e){
    console.log(e.target.data['item_index'])
})


class EventBus{
    constructor(){
        this.events = {}
    }

    emit(type){
        if(this.events[type]){
            this.events[type].apply(null,...arguments)
        }
    }

    on(type,cb){
        if(!this.events[type]){
            this.events[type] = cb;
        }
    }

    off(type){
        delete this.events[type];
    }
}

var list = [{age:12,group:1},{age:20,group:3},{age:12,group:23}]

function sort(arr,key1,key2){
    for(let i = 0;i<arr.length;i++){
        for(let j=0;j<arr.length;j++){
            if(arr[i][key1] < arr[j][key1]){
                [arr[i],arr[j]] = [arr[j],arr[i]]
            }
        }
    }
    for(let i = 0;i<arr.length;i++){
        for(let j=0;j<arr.length;j++){
            if(arr[i][key2] > arr[j][key2]){
                if(arr[i][key1] === arr[j][key1]){
                    [arr[i],arr[j]] = [arr[j],arr[i]]
                }
            }
        }
    }
    return arr;
}

console.log(sort(list,'age','group'))




