const { collection } = require('./common');

function exuteFibo() {
  return new Promise(function (reslove, reject) {
    const cluster = require('cluster');
    const numCPUs = require('os').cpus().length;
    var result = [];
    cluster.setupMaster({
      exec: 'worker.js',
      slient: true,
    });

    if (cluster.isMaster) {
      var workerID = [];
      for (var i = 0; i < Math.min(numCPUs, collection.length); i++) {
        var wk = cluster.fork();
        workerID.push(wk.id);
        wk.send(collection[i]);
      }
      cluster.on('fork', function (worker) {
        if (workerID.indexOf(worker.id) !== -1) {
          // console.log(`[master ${process.pid}] : fork worker ${worker.id}`);
        }
      });
      cluster.on('exit', function (worker, code, signal) {
        // console.log(`[master] : worker ${worker.id} died`);
      });
      var numOfCompelete = 0;
    }

    workerID.forEach(function (id) {
      cluster.workers[id].on('message', function (msg) {
        result.push(msg);
        numOfCompelete++;
        // console.log(`[master] receive message from [worker${id}]: ${msg}`,i,numOfCompelete,collection.length);
        if (numOfCompelete === collection.length) {
          workerID.forEach(function (id) {
            if (!cluster.workers[id].suicide) {
              cluster.workers[id].disconnect();
            }
          });
          reslove(result);
        } else {
          if (collection[i]) {
            cluster.workers[id].send(collection[i]);
          }
          i++;
        }
      });
    });
  });
}

module.exports = exuteFibo;
