const { fibo } = require('./common');

var count = 0;
process.on('message', function (msg) {
  var result = fibo(msg);
  count++;
  //  console.log(`[worker ${cluster.worker.id}] count ${count}`);
  process.send(result);
});
