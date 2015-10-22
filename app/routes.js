module.exports = function(app, passport) {
    var Lob = require('lob')('test_13d025aea339d7f18c0dcab38d68712099c');
    var csv = require("fast-csv");
    var async = require('async')


    var userController = app.controllers.User;



    app.post('/create-post-card', app.excelMulter, function(req, response){

        var file = req.files.file

        var responses = []
        var usersData = []
        csv.fromPath(file.path)
            .on("data", function(data){
                usersData.push(data);
            })
            .on("end", function(){
                usersData.splice(0,1);
                async.each(usersData, function(row, callback) {
                    console.log(row);
                    Lob.postcards.create({
                        description: 'Demo Postcard job',
                        to: {
                            name: row[0],
                            address_line1: row[1],
                            address_city: row[2],
                            address_state: row[3],
                            address_zip: row[4]
                        },
                        front: '<html style="padding: 1in; font-size: 50;">Front HTML for {{name}}</html>',
                        back: '<html style="padding: 1in; font-size: 20;">Back HTML for {{name}}</html>',
                        data: {
                            name: row[0]
                        }
                    }, function (err, res) {
                        if(err){
                            callback(err);
                        }
                        else{
                            console.log("response")
                            console.log(res)
                            responses.push(res);
                            callback()
                        }
                    });

                }, function(err){
                    if(err){
                        response.send(err);
                    }
                    else{
                        response.send(responses);
                    }
                    console.log("done");

                })
            });
    })




    app.post('/signin', userController.signIn);

    //Common Methods
    app.get('/signedinuser', function(req, res){
        if(req.user){
            res.send(req.user.value);
        }
        else{
            res.send(null);
        }
    })
    app.get('/signout', function(req, res){
        req.logout();
        res.send({msg: "successfully logged out", status : true});
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });

};