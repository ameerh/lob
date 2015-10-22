// modules =================================================
var http = require('http');
var express        = require('express');
var cookieParser = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var couchbase = require("couchbase");
var session      = require('express-session');
var passport = require('passport');
var multer = require('multer');

var PartnerServer = function PartnerServer (config) {
    config.set('paths', []);
    var app = module.exports = express();
    app.config = config;
    app.log = require("./app/utils/logger")(app);
    app.customerDomain = config.get("customerDomain");
// Configuration
    var port;
    var env = process.env.NODE_ENV || 'development';
    if ('development' == env) {
        port = config.get("port");
        //Database Connection
        app.CBCluster = new couchbase.Cluster(config.get("db").url);
        app.bucket = config.get("db").bucket;
        app.password = config.get("db").password;
        // configure stuff here
        //  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }else{
        port = config.get("portOnline");
        app.CBCluster = new couchbase.Cluster(config.get("dbOnline").url);
        app.bucket = config.get("dbOnline").bucket;
        app.password = config.get("dbOnline").password;
        //app.use(express.errorHandler({dumpExceptions: true, showStack: true }));
    }
    app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
    app.use(bodyParser.json())    // parse application/json
    app.use(methodOverride());
    app.errorHandler = require("./app/utils/error-handler.js")(app);
    app.responder = require("./app/utils/responder")(app);
    app.excelMulter = multer({ dest: './public/excelFiles/'})

    //ADD BELOW CODE
    app.setMaxListeners(0);

    // maxSockets greater ethan 10 sockets
    http.globalAgent.maxSockets = 1200;

    //var port = config.get("port");

    //CORS middleware
    var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, companyID,userID');

        if (req.method == 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    };
    app.use(allowCrossDomain);
    app.use(cookieParser());
    app.use(bodyParser.json()); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
        resave: true,
        saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
    app.imageMulter = multer({inMemory: true, putSingleFilesInArray: true});


    require('./config/passport')(passport, app); // pass passport for configuration
    require('./app/controllers')(app, passport);
    app.responder = require("./app/utils/responder.js")(app);
    app.authorize = require("./app/utils/authorize.js")(app);

    app.all('/api/*', app.authorize.authorize);

    require('./app/routes')(app, passport); // pass our application into our routes

    process.on('uncaughtException', function (e) {
        console.log(e.stack);
    });

    this.app = app;
    return this;
};


PartnerServer.prototype.start = function () {
    var   _this = this;
    var env = process.env.NODE_ENV || 'development';
    var port;
    if ('production' == env) {
        port = 7010;
    }else {
        port = 7000;
    }

    port = process.env.PORT || port;
    http.createServer(this.app).listen(port, function() {
        console.log( "created new boilerplate app worker at " + port);
    });
};

module.exports = PartnerServer;