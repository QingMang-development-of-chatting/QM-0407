const serverPath = 'http://localhost:3000';
//const serverPath = 'http://qingmangserver.free.idcfengye.com';
module.exports = {
  publicPath: './',
  outputDir: 'dist',   //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: false, //是否自动弹出浏览器页面
    host: "localhost",
    port: '8080',
    https: false,   //是否使用https协议
    hotOnly: false, //是否开启热更新
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: serverPath, //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
}
