const { override, addBabelPlugin, babelInclude } = require('customize-cra')
const path = require('path')

module.exports = override(
  // Add plugins to support optional chaining and nullish coalescing
  addBabelPlugin(require.resolve('@babel/plugin-proposal-optional-chaining')),
  addBabelPlugin(require.resolve('@babel/plugin-proposal-nullish-coalescing-operator')),
  // Force Babel to transpile the problematic module in node_modules
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/@walletconnect'),
    path.resolve(__dirname, 'node_modules/unstorage'),
    path.resolve(__dirname, 'node_modules/@web3modal')
  ])
)
