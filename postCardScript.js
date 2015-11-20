/**
 * Created by NovatoreSolutions-mac2 on 11/11/15.
 */
var Lob = require('lob')('live_2c4bb41bd1af2d590a383226355d7539ee0');
var csv = require("fast-csv");
var async = require('async');
var excelbuilder = require('msexcel-builder');



//// Create a new workbook file in current working-path
//var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')
//
//// Create a new worksheet with 10 columns and 12 rows
//var sheet1 = workbook.createSheet('sheet1', 10, 12);
//
//// Fill some data
//sheet1.set(1, 1, 'I am title');
//for (var i = 2; i < 5; i++)
//    sheet1.set(i, 1, 'test'+i);
//
//// Save it
//workbook.save(function(err){
//    if (err)
//        throw err;
//    else
//        console.log('congratulations, your workbook created');
//});



//Lob.postcards.list({count: 100, offset: req.params.offSet}, function (err, res) {
//    console.log(err, res);
//
//    response.send(res);
//
//});

var array = [];
for(var i=0; i<=5400; i+=100){
    array.push(i)
}


var postCardsData = []

async.each(array, function(offSet, callback) {
Lob.postcards.list({count: 100, offset: offSet}, function (err, res) {
    if(err){
        callback(err)
    }
    else{
        res.data.forEach(function(postCardData){
            postCardsData.push(postCardData);
        })
        console.log(postCardsData.length);
        callback()
    }
});
}, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("All post cards fetched successfully");
        console.log(postCardsData);
        console.log(postCardsData.length);


        var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')


        var sheet1 = workbook.createSheet('sheet1', 18, postCardsData.length+10);

        sheet1.set(1, 1, 'ID');
        sheet1.set(2, 1,  'Date Created');
        sheet1.set(3, 1,  'Date Modified');
        sheet1.set(4, 1,  'Expected Delivery Date');
        sheet1.set(5, 1,  'Tracking ID');
        sheet1.set(6, 1,  'Tracking Number');
        sheet1.set(7, 1,  'Tracking Carrier');
        sheet1.set(8, 1,  'Address ID');
        sheet1.set(9, 1,  'Name');
        sheet1.set(10, 1,  'School');
        sheet1.set(11, 1,  'Address');
        sheet1.set(12, 1,  'City');
        sheet1.set(13, 1,  'State');
        sheet1.set(14, 1,  'Zip');
        sheet1.set(15, 1,  'Country');
        sheet1.set(16, 1,  'Front Image');
        sheet1.set(17, 1,  'Back Image');
        sheet1.set(18, 1,  'PDF Link');


        postCardsData.forEach(function(postCard, index){
            var i = index + 2;
            console.log("index")
            console.log(i)

            sheet1.set(1, i, postCard.id);
            sheet1.set(2, i, postCard.date_created);
            sheet1.set(3, i, postCard.date_modified);
            sheet1.set(4, i, postCard.expected_delivery_date);
            sheet1.set(5, i, postCard.tracking.id);
            sheet1.set(6, i, postCard.tracking.tracking_number);
            sheet1.set(7, i, postCard.tracking.carrier);
            sheet1.set(8, i, postCard.to.id);
            sheet1.set(9, i, postCard.to.name);
            sheet1.set(10, i, postCard.to.company);
            sheet1.set(11, i, postCard.to.address_line1);
            sheet1.set(12, i, postCard.to.address_city);
            sheet1.set(13, i, postCard.to.address_state);
            sheet1.set(14, i, postCard.to.address_zip);
            sheet1.set(15, i, postCard.to.address_country);
            sheet1.set(16, i, postCard.thumbnails[0].large);
            sheet1.set(17, i, postCard.thumbnails[1].large);
            sheet1.set(18, i, postCard.url);
        })


        workbook.save(function(err){
            if (err)
                throw err;
            else
                console.log('congratulations, your workbook created');
        });

    }
})

