// const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  // baseUrl: IS_PRODUCTION
  // ? 'http://51.158.77.168:8000'
  // : '/',
  // For Production, replace set baseUrl to CDN
  // And set the CDN origin to `yourdomain.com/static`
  // Whitenoise will serve once to CDN which will then cache
  // and distribute
  devServer: {
    proxy: {
      '/api*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/'
      },
      '/admin': {
        // Forward frontend dev server request for /admin to django dev server
        target: 'http://localhost:8000/'
      },
      // '/ws*': {
      //   // Forward frontend dev server request for /ws to django dev server
      //   target: 'localhost:8000/'
      // }
    }
  }
}
