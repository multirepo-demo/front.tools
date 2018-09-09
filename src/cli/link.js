const { basename } = require('path')
const { exec, FRONT_HOME, log } = require('../utils')

const link = (packageName, CWD) => {
  log.info(`Making 'npm link' in <${packageName}> folder`)
  exec(`npm`, ['link'], FRONT_HOME + '/' + packageName)
    .then(() => log.info(`Making 'npm link ${packageName}' in <${basename(CWD)}> folder`))
    .then(() => exec(`npm`, ['link', packageName], CWD))
    .then(() => log.info(`Linking of package <${packageName}> finished successfully`))
    .catch(() => log.error(`Linking of package <${packageName}> failed`))  
}

module.exports = {
  help: `
    front link [package-name-from-FRONT_HOME-folder] - Link package from '$FRONT_HOME' to current
  `,
  run: ([packageName], CWD) => {
    link(packageName, CWD)
  }
}