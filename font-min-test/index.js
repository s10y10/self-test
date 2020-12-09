var Fontmin = require('fontmin');

var fontmin = new Fontmin()
    .src('fonts/*.ttf')
    .dest('build/fonts')
    .use(
        Fontmin.glyph({
            text:"$,-.0234CDEHJMN\\^abcdefghijklmnopqrstuvwxy{}",
            hinting:true
        })
    )

    fontmin.run(function (err, files) {
        if (err) {
            throw err;
        }
    
        console.log(files[0]);
        // => { contents: <Buffer 00 01 00 ...> }
    });