var cluster = require('cluster'),
    nconf = require('nconf'),
    fs = require('fs'),
    BoilerplateServer =  require("./BoilerplateServer"),
    config = nconf.argv().env();

var configFile = config.get('config');
if (configFile) {
    if (!fs.existsSync(configFile)) {
        console.error("Config file does not exist at '%s'", configFile);
        process.exit(0);
    } else {
        console.log('Loading config from %s', configFile);
        config.file({file: configFile});
    }
}
config.defaults(require('./config/app-config.json'));

var workers = config.get("workers") || 1;
if(workers>1){
    if (cluster.isMaster) {
        for (var i = 0; i < workers; i++) {
            cluster.fork();
        }
        cluster.on('exit', function (worker, code, signal) {
            console.log('Worker %d died (%s). restarting...', worker.process.pid, signal || code);
            cluster.fork();
        });
    } else {
        var boilerplateServer = new BoilerplateServer(config);
        boilerplateServer.start.apply(boilerplateServer);
    }
}else {
    var boilerplateServer = new BoilerplateServer(config);
    boilerplateServer.start.apply(boilerplateServer);
}