const exuteFibo = require('./master');
const exuteFiboSingle = require('./single');

(async () => {
  console.time('cluster');
  await exuteFibo();
  console.timeEnd('cluster');
})();

// (async () => {
//   console.time('single');
//   await exuteFiboSingle();
//   console.timeEnd('single');
// })();
