class EventBus{
     constructor(){
         this.events = {}
     }

     on(type, fun){
        this.events[type] = fun;
     }

     off(type){
        delete this.events[type];
     }

     emit(type){
        let fun = this.events[type];
        if(!fun)return;
        let arg = [...arguments].slice(1);
        fun.call(null,...arg)
     }
}
module.exports = new EventBus();