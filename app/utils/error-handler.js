/**
 * Created by NovatoreSolutions-mac2 on 24/06/15.
 */

module.exports  = function(app){
    var ErrorHandler ={};
    var log = app.log;

    ErrorHandler.handle409 = function(message, res){
        var error = new Error(message);
        error.status = 409;
        log.error(error.message, error);
        res.send(409,error);
    }

    ErrorHandler.handle400 =  function(message, res){
        var error = new Error(message);
        error.status = 400;
        log.error(error.message, error);
        res.send(400,error);
    }
    ErrorHandler.handle404 = function(message, res){
        var error = new Error(message);
        error.status = 404;
        log.error(error.message, error);
        res.send(500,error);
    }

    ErrorHandler.handle500 = function(err, res){
        err.status = 500;
        log.error(err.message, err, err.stack);
        res.status(500).send(err.message)
    }
    return ErrorHandler;
}
