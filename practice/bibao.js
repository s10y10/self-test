function test(){
    var count = 0;
    function b (){
        count++;
        console.log(count);
        return count;
    }
    return b;
}

var a = test();
a();
a();