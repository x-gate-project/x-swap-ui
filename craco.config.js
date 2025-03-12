const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Add the NodePolyfillWebpackPlugin to the plugins array
      webpackConfig.plugins.push(new NodePolyfillPlugin())
      return webpackConfig
    }
  }
}
