const semver = require('semver');
const { log } = require('./utils')
const { get } = require('./request')
const { existsSync } = require('fs')

exports.checkDeps = (commonDeps, currentDeps) => {
  Object.keys(commonDeps).forEach((name) => {
    const version = commonDeps[name]
    if (!currentDeps || !currentDeps[name]) return;
    const currenVersion = semver.coerce(currentDeps[name])
    const commonVersion = semver.coerce(version)
    if(!currenVersion || !commonVersion) return
    if(semver.gt(commonVersion, currenVersion)) 
      log.warn(`Your version of '${name}' is lower then in 'front.core' (${commonVersion} > ${currenVersion})`)
    if(semver.lt(commonVersion, currenVersion)) 
      log.warn(`Your version of '${name}' is higher then in 'front.core' (${commonVersion} < ${currenVersion})`)
  })
}

exports.getCommonDeps = () => {
  const CORE_PACKAGE_URL = "https://raw.githubusercontent.com/multirepo-demo/front.core/master/package.json";
  return get(CORE_PACKAGE_URL).dependencies;
}

exports.getPackageDeps = (packagePath) => {
  if (!existsSync(packagePath + "/package.json")) throw new Error(`'${packagePath}' is no an npm package folder`);
  return require(`${packagePath}/package.json`).dependencies;
}