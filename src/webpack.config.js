const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const OneToOnePlugin = require('./one-to-one-plugin')
const entry = require('webpack-glob-entry')
const { checkDeps, getCommonDeps, getPackageDeps } = require('./dependencies-checker')

const CWD = process.cwd();
const isServer = process.argv[1].includes('webpack-dev-server')

const commonDeps = getCommonDeps()
checkDeps(commonDeps, getPackageDeps(CWD))
const externals = Object.keys(commonDeps)
  .join('|')
  .replace('$', '\$')
  .replace('/', '\\/')
  .replace('.', '\\.')

module.exports = (environment, args) => {
  const env = args.mode || 'development'
  const isProd = env === 'production'
  const isDev = !isProd

  const config = {}

  config.mode = env

  config.stats = 'minimal'

  config.devServer = {
    stats: 'minimal',
    contentBase: path.resolve(CWD, "dist"),
  }

  config.optimization = {
		minimize: false
	},
  
  config.context = CWD + '/src'

  if (isProd) config.externals = new RegExp("(" + externals + ")", 'i')

  config.entry = entry(path.resolve(CWD, 'src/*.entry.js'))

  config.output = {
    filename: '[name].entry.js',
    path: path.resolve(CWD, 'dist'),
    libraryTarget: 'umd',
  }

  config.devtool = 'inline-source-map'

  config.module = {}
  config.module.rules = []
  config.plugins = []

  config.module.rules.push({ 
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      }
    }
  })

  if(isDev && isServer) config.plugins.push(new htmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, 'template.html')
  }))

  if(args.transpile) config.plugins.push(new OneToOnePlugin()) // Add ability to transpile without bundling

  return config
}
