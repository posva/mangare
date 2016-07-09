const winston = require('winston')

var loggers = []

module.exports = function (name, level) {
  name = name || 'Mangare'
  level = level || 'info'
  if (loggers.indexOf(name) < 0) {
    loggers.push(name)
    if (process.env.NODE_ENV === 'testing') {
      return winston.loggers.add(name, {
        transports: [
          new winston.transports.File({ filename: 'test.log' })
        ]
      })
    } else {
      return winston.loggers.add(name, {
        console: {
          label: name,
          level,
          colorize: true
        }
      })
    }
  }
  return winston.loggers.get(name)
}
