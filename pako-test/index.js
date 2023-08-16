const pako = require('pako')
const fs = require('fs')

const o = fs.readFileSync('./o.json').toString();

const inf = new pako.Inflate({to:'string'})

const binaryString = pako.deflate(JSON.stringify(o), { to: 'string' });

const restored = JSON.parse(pako.inflate(binaryString, { to: 'string' }));

console.log(restored);
