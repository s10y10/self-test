class MyPromise{
    constructor(fn){
        this.state = 'pending';
        this.result = undefined;
        this.reason = undefined;
        this.fulfillArr = [];
        this.rejectedArr = [];
        let resolve = (data)=>{
            if(this.state === 'pending'){
                this.state = 'fulfilled'
                this.result = data;
                this.fulfillArr.forEach(fn => {
                    fn(this.result);
                })
            }
        }
        let reject = (err)=>{
            if(this.state === 'pending'){
                this.state = 'rejected';
                this.reason = err;
            }
        }
        try{
            fn(resolve, reject)
        }catch(e){
            reject(e);
        }
    }

    then(onFullfilled,onRejected){
        switch(this.state){
            case 'fulfilled':
                this.fulfillArr.push(onFullfilled);
                // onFullfilled(this.result);
                break;
            case 'rejected':
                this.rejectedArr.push(onRejected);
                // onRejected(this.reason);
                break;
        }
        return this;
    }
}

var p = new MyPromise((resolve,reject)=>{
    console.log(1);
    resolve();
})
p.then(()=>{
    console.log(2);
}).then(()=>{
    console.log(3);
})