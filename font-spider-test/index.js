const fontSpider = require('font-spider');
const fs = require('fs-extra');
const path = require('path');

fontSpider
  .spider([__dirname + '/index.html'], {
    silent: false,
  })
  .then(function (webFonts) {
    fs.emptyDirSync(path.resolve(__dirname, 'output'));
    for (let i = 0; i < webFonts.length; i++) {
      let font = webFonts[i];
      font.chars += ' ';
      for (let j = 0; j < font.files.length; j++) {
        let file = font.files[j];
        let fontName = file.url.replace(
          `c:/workspace/own/self-test/font-spider-test/baseFont/`,
          ''
        );
        const newPath = path.resolve(__dirname, 'output', fontName);
        // 这里是将源字体文件拷贝一份到输出目录,并且将解析出的file.url指向拷贝后的地址
        // 这样就可以实现在不修改源字体文件的情况下直接压缩输出目录的字体文件
        fs.copyFileSync(file.url, newPath);
        file.url = newPath;
      }
    }
    return fontSpider.compressor(webFonts, { backup: false });
  })
  .then(function (webFonts) {
    console.log(webFonts);
  })
  .catch(function (errors) {
    console.log(errors);
  });