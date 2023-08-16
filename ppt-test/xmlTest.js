const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
fs.readFile(__dirname + '/abcd/ppt/slides/slide1.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        // console.log(JSON.stringify(result))
        fs.writeFileSync('./xmlTest.json',JSON.stringify(result))
    });
});