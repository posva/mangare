const winston = require('winston')

var loggers = []

module.exports = function (name, level) {
  name = name || 'Mangare'
  level = level || 'info'
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
