const winston = require('winston')

var loggers = []

module.exports = function (name, level) {
  name = name || 'Mangare'
  level = process.env.NODE_ENV === 'testing' ? 'error' : (level || 'info')
  if (loggers.indexOf(name) < 0) {
    loggers.push(name)
    return winston.loggers.add(name, {
      console: {
        label: name,
        level,
        colorize: true
      }
    })
  }
  return winston.loggers.get(name)
}
