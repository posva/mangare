const request = require('request')
const logger = require('../logger')('api/page')

exports.imageBase64 = function imageBase64 (req, res) {
  const query = req.query.url
  if (!query) {
    logger.warn('Missing url query')
    return res.status(404).send('Pass un url query')
  }
  const image = query.replace(/^(https?:)?\/\//, '')
  const url = `https://images.weserv.nl?url=${image}&encoding=base64`
  logger.debug(`Retrieving base64 for image ${req.query.url}`)
  request.get(url, (err, response, data) => {
    if (err) {
      logger.error(err)
      return res.status(500).send(err)
    }
    if (response.statusCode !== 200) {
      logger.error(`(${response.statusCode}) Could not retrieve base64 for image ${req.query.url}`)
      return res.status(response.statusCode).send('Error')
    }
    logger.debug(`Retrieved base64 for image ${req.query.url}`)
    res.send(data)
  })
}
