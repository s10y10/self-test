var cluster = require('cluster');
function fibo(n) {
    return n == 0 ? 0 : n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
var count = 0;
process.on('message', function(msg) {
 var result = fibo(msg);
 count++;
//  console.log(`[worker ${cluster.worker.id}] count ${count}`);
 process.send(result);
});