/**
 * Created by hassan on 3/23/15.
 */

var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');
module.exports = function(passport, app) {

    var couchbase = require("couchbase");
    var ViewQuery = couchbase.ViewQuery;


    var CbBucket   = app.bucket;
    var CbPassword = app.password;
    var db = app.CBCluster;

    generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    validPassword = function(password, storedPassword) {
        return bcrypt.compareSync(password, storedPassword);
    };

    passport.serializeUser(function(user, done) {
        done(null, user.value.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        var bucket = db.openBucket(CbBucket, CbPassword,function(err) {
            if (err) {
                // Failed to make a connection to the Couchbase cluster.
                return done(err);
            }

            bucket.get(email, function (err, user) {
                done(err, user);
            });
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            console.log(email);
            console.log(password);
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                    var bucket = db.openBucket(CbBucket, CbPassword,function(err) {
                        if (err) {
                            // Failed to make a connection to the Couchbase cluster.
                            return done(err);
                        }

                        bucket.get(email, function(err, user){
//                            if (err){
//
//                                console.log(err);
//                                console.log(user);
//                                return done(err);
//                            }

                            if (user){
                              return done(null, false, {msg: "email already taken"});
                            }
                            else{
                                var newUser = {
                                    type: "user",
                                    email: email,
                                    password: generateHash(password),
                                    role: req.param('role')
                                }
                                console.log(newUser);

                                bucket.insert(newUser.email, newUser, function(err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    bucket.get(email, function(err, newlyRegisteredUser){
                                        if (err){
                                            throw err;
                                        }
                                        return done(null, newlyRegisteredUser);
                                    });
                                })
                            }
                        })

                    });

            });

        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            var bucket = db.openBucket(CbBucket, CbPassword,function(err) {
                if (err) {
                    // Failed to make a connection to the Couchbase cluster.
                    return done(err);
                }
                bucket.get(email, function(err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false, {msg: "user does not exist"}); // req.flash is the way to set flashdata using connect-flash

                    if (!validPassword(password, user.value.password))
                        return done(null, false, {msg: "password is not valid"});
                    return done(null, user);

                });
            });


        }));
}