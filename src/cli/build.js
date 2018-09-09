const { basename } = require('path')
const { getAllSymlinksInFolder, packageHasFrontTools, exec, FRONT_HOME, log } = require('../utils')

const webpack = (args, CWD) => {
	const process = args.includes('--server') ? 'webpack-dev-server' : 'webpack'
	args = args.filter(arg => arg !== '--server')

	if(args.includes('--with-links')) {
		args = args.filter(arg => arg !== '--with-links')
		getAllSymlinksInFolder(CWD + "/node_modules/").forEach((packageName) => {
			if(packageHasFrontTools(`${CWD}/node_modules/${packageName}`))
				webpack(args, `${FRONT_HOME}/${packageName}`)
		})
	}

	if(!args.includes('--config')) {
		const configDefaults = require(CWD + "/package.json").front || {}
		if (configDefaults.transpile) args.push('--transpile')
		args = [ "--config", `${CWD}/node_modules/front.tools/src/webpack.config.js`, ...args ]
	}

	log.info(`Running '${process} ${args.join(' ')}' on <${basename(CWD)}>`)

	exec(`${CWD}/node_modules/.bin/${process}`, args, CWD)
		.then(() => log.info(`Building package <${basename(CWD)}> finished successfully`))
		.catch(() => log.error(`Building package <${basename(CWD)}> failed`))
}

module.exports = {
  help: `
    front build [webpack-arguments] - Build source code from (src/index.js) to (dist/index.js).
      --config - absolute path to config (default: front.tools/src/webpack.config.js)
      --mode - available development|production (default: development)
      --with-links - run webpack in npm link'ed folders too (usefull for development) (default: false)
      --server - run with webpack-dev-server (default: false)
  `,
  run: (args, CWD) => {
    webpack(args, CWD)
  }
}