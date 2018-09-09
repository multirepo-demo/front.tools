const { basename } = require('path')
const { getAllSymlinksInFolder, exec, FRONT_HOME, log } = require('../utils')

const unlink = (packageName, CWD) => {
  if(packageName === 'front.tools') return
  if(packageName === '--all') {
    return getAllSymlinksInFolder(CWD + "/node_modules/")
      .reduce((promiseChain, pack) => {
        return promiseChain.then(() => unlink(pack, CWD))
      }, Promise.resolve())
  }

	log.info(`Making 'npm unlink ${packageName}' in <${basename(CWD)}> folder`)

	return exec(`npm`, ['unlink', '--no-save', packageName], CWD)
		.then(() => log.info(`Making 'npm unlink' in <${packageName}> folder`))
		.then(() => exec(`npm`, ['unlink'], `${FRONT_HOME}/${packageName}`))
		.then(() => log.info(`Unlinking of <${packageName}> success`))
		.catch(() => log.error(`Unlinking <${packageName}> failed`))
}

module.exports = {
  help: `
    front unlink [package-name-from-FRONT_HOME-folder] - Unlink package from current
      --all - unlink all
  `,
  run: ([packageName], CWD) => {
    unlink(packageName, CWD)
  }
}