/**
 * Created by hassan on 3/5/15.
 */

var fs = require('fs');
var path = require('path');
module.exports = function (app, passport) {
//    var log = app.log;
    app.controllers = app.controllers || {};
    fs.readdirSync(__dirname).forEach(function (f) {
        if (f !== "index.js" && path.extname(f) === '.js') {
            var controller = require(path.join(__dirname, f))(app, passport);
            if (controller && controller.name && controller.name.length && !(controller.name in app.controllers)) {
//                log.info('loading controller: ' + controller.name);
                app.controllers[controller.name] = controller;
            }
        }
    });
};
