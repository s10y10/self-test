const { collection, fibo } = require('./common');

function a(n) {
  return new Promise((resolve) => {
    const result = fibo(n);
    resolve(result);
  });
}

function exuteFiboSingle() {
  const pl = collection.map((n) => {
    return a(n);
  });
  return Promise.all(pl);
}

module.exports = exuteFiboSingle;
