module.exports = function(app, passport) {
    var Lob = require('lob')('live_2c4bb41bd1af2d590a383226355d7539ee0');
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
                async.eachLimit(usersData, 5, function(row, callback) {
                    var to = {
                        company: row[2],
                        address_line1: row[3],
                        address_city: row[4],
                        address_state: row[5],
                        address_zip: row[6]
                    }

                    to.name = (row[0]||row[1]? row[0]+" "+row[1] : "The Best Coach")

                    Lob.postcards.create({
                        description: 'Demo Postcard job',
                        to: to,
                        //front:  '<html> <head> <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"> <title>Lob.com Sample 6x11 Postcard Front</title> <style> *, *:before, *:after { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } body { width: 6.25in; height: 4.25in; margin: 0; padding: 0; /* If using an image, the background image should have dimensions of 1875x1275 pixels. */ background-image: url(https://dl.dropboxusercontent.com/u/10736638/postCardFront.jpg); background-size: 6.25in 4.25in; background-repeat: no-repeat; } #safe-area { position: absolute; width: 10.875in; height: 5.875in; left: 0.1875in; top: 0.1875in; } .text { margin: 10px; font-family: Open Sans; font-weight: 400; font-size: 60px; color: white; text-shadow: 2px 2px black; } </style> </head> <body> <div id="safe-area"> <!-- All text should appear within the safe area. --> </div> </body> </html> ',
                        front: ' <html> <head> <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"> <title>Lob.com Sample 4x6 Postcard Front</title> <style> *, *:before, *:after { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } body { width: 6.25in; height: 4.25in; margin: 0; padding: 0; /* If using an image, the background image should have dimensions of 1875x1275 pixels. */ background-image: url(https://dl.dropboxusercontent.com/u/10736638/postCardFront.jpg); background-size: 6.25in 4.25in; background-repeat: no-repeat; } #safe-area { position: absolute; width: 5.875in; height: 3.875in; left: 0.1875in; top: 0.1875in; } .text { margin: 10px; font-family: "Open Sans"; font-weight: 400; font-size: 40px; color: white; text-shadow: 2px 2px black; } </style> </head> <body> <div id="safe-area"> <!-- All text should appear within the safe area. --> </div> </body> </html> ',
                        //back: ' <html> <head> <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Fira+Sans:400italic, 400" rel="stylesheet" type="text/css"> <title>Lob.com Sample 6x11 Postcard Back</title> <style> *, *:before, *:after { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } body { width:6.25in; height:4.25in; margin:0; padding:0; /* If using an image, the background image should have dimensions of 3375x1875 pixels. */ background-image: url(https://dl.dropboxusercontent.com/u/10736638/postCardBack.jpg); background-size: 6.25in 4.25in; background-repeat: no-repeat; } #safe-area { position: absolute; width: 10.875in; height: 5.875in; left: 0.1875in; top: 0.1875in; } #ink-free { position: absolute; width: 4in; height: 2.375in; right: .1in; bottom: .05in; background-color: white; } .text { margin: 10px; font-family: Open Sans; font-weight: 400; width: 600px; font-size: 28px; color: white; text-shadow: 2px 2px black; } .salutation{ margin-top: 50px; margin-left: 55px; font-family: Fira Sans; color: #75253b; font-size: 29px;/* Approximation due to font substitution */ font-weight: 400; line-height: 27.089px;/* Approximation due to font substitution */ text-align: left; transform: scaleX(1.075);/* width and height properties ommitted due to transform */ }.address { width:250px; margin-top: 90px; margin-left: 635px; font-family: Fira Sans; color: #000000; font-size: 30px;/* Approximation due to font substitution */ font-style: italic; line-height: 32.57px;/* Approximation due to font substitution */ text-align: center; } </style> </head> <body> <div id="safe-area"> <!-- All text should appear without the safe area. --> <div class="salutation"> Dear {{name}}, </div><div class="address" > <p style="font-style: italic !important">{{address}}</p> </div> </div> </body> </html>',
                        back: '<html> <head> <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Fira+Sans" rel="stylesheet" type="text/css"> <title>Lob.com Sample 4x6 Postcard Back</title> <style> *, *:before, *:after { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } body { width: 6.25in; height: 4.25in; margin: 0; padding: 0; /* If using an image, the background image should have dimensions of 1875x1275 pixels. */ background-image: url(https://dl.dropboxusercontent.com/u/10736638/postCardBack.jpg); background-size: 6.25in 4.25in; background-repeat: no-repeat; } #safe-area { position: absolute; width: 5.875in; height: 3.875in; left: 0.1875in; top: 0.1875in;} #ink-free { position: absolute; width: 3.5in; height: 2.7in; right: -0.1875in; bottom: -0.1875in; background-color: white; } .text { margin: 10px; width: 200px; font-family: "Open Sans"; font-weight: 400; font-size: 20px; color: white; text-shadow: 2px 2px black; }.salutation{ margin-top: 15px; margin-left: 50px; font-family: Fira Sans; color: #75253b; font-size: 18px; font-weight: 400; line-height: 27.089px; text-align: left; transform: scaleX(1.075); } .address { width:250px; margin-top: 90px; margin-left: 300px; font-family: Fira Sans; color: #000000; font-size: 22px;/* Approximation due to font substitution */ /*font-style: italic;*/ line-height: 32.57px;/* Approximation due to font substitution */ text-align: center; } </style> </head> <body> <div id="safe-area"> <!-- All text should appear without the safe area. --> <div class="salutation"> Dear {{name}}, </div> <div class="address"> <i>{{address}}</i> </div> </div> </body> </html> ',
                        //back: '<html> <head> <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Fira+Sans:400italic,400" rel="stylesheet" type="text/css"><p style="      	font-family: Fira Sans;">Hello</p></head>',
                        data: {
                            name: "Coach"+ (row[0] ? " "+row[0]: ""),
                            address: row[2] + " " + row[3] + " " + row[4] + ", "+ row[5] + " " + row[6]
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
                        console.log("Error")
                        console.log(err);
                        console.log(response.headers);
                        response.send(err);
                    }
                    else{
                        console.log("Success")
                        console.log(response.headers)
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




//front: '<html style="padding: 1in; font-size: 50;">Front HTML for {{name}}</html>',
//    back: '<html style="padding: 1in; font-size: 20;">Back HTML for {{name}}</html>',