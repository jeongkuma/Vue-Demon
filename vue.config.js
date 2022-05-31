module.exports = {
  publicPath: './',
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/scp': {
        target: 'http://localhost:10211' // local
      },
      '/iot-ws': {
        target: 'ws://192.168.50.253:10211/scp',
        changeOrigin: true,
        ws: true
      }
    }
  },
  // 웹팩의 설정을 바로 사용하기 위해서는 configureWebpack에서 정의를 한다.
  configureWebpack: {
    externals: {
      moment: 'moment',
      mapInfraMap: 'com.mapInfra.Map',
      mapInfraPoint: 'com.mapInfra.Point'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'common'
          }
        }
      }
    }
  },
  // index.html 에서 prefetch 기능을 꺼준다. (경우에 따라 파일이 두번 로드함)
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  }
  // configureWebpack:{
  //   performance: {
  //     hints: false
  //   },
  //   optimization: {
  //     splitChunks: {
  //       minSize: 10000,
  //       maxSize: 250000,
  //     }
  //   }
  // }
}
