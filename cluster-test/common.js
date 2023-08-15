function fibo(n) {
  return n == 0 ? 0 : n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

const collection = [40, 41, 41, 39, 40, 41, 41, 39, 40, 41, 41, 39];

module.exports = {
  fibo,
  collection,
};
