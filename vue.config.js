module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false
    },
    i18n: {
      locale: "zh-hans",
      fallbackLocale: "zh-hans",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  transpileDependencies: ["quasar"],
  productionSourceMap: false,
  devServer: {
    open: false,
    host: "localhost",
    port: 8080,
    https: false,
    compress: true,
    proxy: {
      "/api": {
        target: "https://localhost:5001/", // 本地测试
        ws: true, // websocket
        changeOrigin: true, // allow cross-domain
        crossorigin: "anonymous",
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
