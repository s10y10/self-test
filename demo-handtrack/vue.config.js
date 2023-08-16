module.exports = {
  publicPath: './',
  productionSourceMap: false,
  css: {
    extract: false
  },
  filenameHashing: false,
  configureWebpack: {
    output: {
      chunkFilename: `js/[name].[contenthash:8].js`
    },
    module: {
      unknownContextCritical: false
    },
  },
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      inject: true
    }
  }
}
