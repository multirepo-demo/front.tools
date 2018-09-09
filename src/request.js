const request = require('sync-request');

/**
 * Sync get request which return JSON
 * 
 * @param {string} url url for get request
 */
exports.get = (url) => {
  // @ts-ignore
  const res = request('GET', url)
  return JSON.parse(res.getBody('utf8'))
}