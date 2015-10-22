/**
 * Created by macbookpro on 04/05/15.
 */

module.exports = function(app,passport) {
    var couchbase = require("couchbase")
    var bcrypt   = require('bcrypt-nodejs')
    var uuid = require('uuid')
//    var ViewQuery = couchbase.ViewQuery
    var CbBucket = app.bucket;
    var password = app.password;
    var db = app.CBCluster;
    var fs = require('fs')

    var Controller = {
        name: 'User'
    }

    var generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }


    //****************************************   General  ****************************************
    function convertToArray(allDocs){
        var docs = [];
        for (elem in allDocs) {
            docs.push(allDocs[elem].value)
        }
        return docs;
    }

    function refDoesNotExist(refArray, refID){
        if(!refArray || refArray == 0 || refArray.indexOf(refID) == -1){
            return true
        }
        else{
            return false
        }
    }
    function getMultiDocs(docsRef, response, onComplete){
        var bucket = db.openBucket(CbBucket, password, function(err) {
            if (err){
                app.errorHandler.handle500(err, response);
            }
            else{
                bucket.getMulti(docsRef, function(err, allDocs) {
                    if(err){
                        app.errorHandler.handle500(err,response);
                    }
                    else{
                        var docs = convertToArray(allDocs);
                        onComplete(docs);
                    }
                })
            }
        })
    }



    //****************************************   SIGN IN  ****************************************
    Controller.signIn = function(req, res){
        passport.authenticate('local-login', function (err, user, info) {
            if (err){
                app.errorHandler.handle500(err,res)
            }
            if (!user) {
                res.send(info)
            }
            else{
                req.logIn(user, function (err) {
                    res.send(user.value)
                })
            }
        })(req, res)
    }



    return Controller
}