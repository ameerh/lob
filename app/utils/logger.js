var winston = require('winston');
var nconf = require('nconf');
var config = nconf.argv().env();

module.exports = function (app) {
    var options = app.config.get("logging") || {}
    var logLevels = {
        levels: {
            debug: 0,
            info: 1,
            error: 2
        },
        colors: {
            debug: 'yellow',
            info: 'green',
            error: 'red'
        }
    };

    if (options.logPath) {
        var debug    = new winston.transports.File({name: 'debug', colorize: true, level: 'debug', filename: options.logPath + '/debug.log', timestamp: true});
        var info     = new winston.transports.File({name: 'info',  colorize: true, level: 'info',  filename: options.logPath + '/info.log', timestamp: true});
        var error    = new winston.transports.File({name: 'error', colorize: true, level: 'error', filename: options.logPath + '/error.log', timestamp: true, handleExceptions: true});
        var transports = [
            new (winston.transports.Console)({
                handleExceptions: true,
                json: true
            }),
            debug, info, error
        ];
        winston.addColors(logLevels.colors);

        var logger = new (winston.Logger)({
            levels: logLevels.levels,
            transports: transports
        });
    }
    return logger
}