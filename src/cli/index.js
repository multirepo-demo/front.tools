const { log } = require('../utils')

const scripts = {
  help: {
    help: `
      front help - for help
    `,
    run: (args, CWD) => {
      Object.keys(scripts).forEach(scriptName => 
        console.log(scripts[scriptName].help.replace(/\t/g, '  '))
      )
    }
  },
  build: require('./build'),
  link: require('./link'),
  unlink: require('./unlink')
}

module.exports = (CWD, argv) => {
	const [ ,, scriptName, ...args ] = argv
	const script = scripts[scriptName]
	if (!script) {
		scripts['help'].run(args, CWD)
		log.error(`There is no script with name '${scriptName}'`)
	} else {
		script.run(args, CWD)
	}
}
