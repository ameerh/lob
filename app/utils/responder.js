/**
 * Created by hassan on 3/24/15.
 */
//module.exports = function(app) {
//    var Responder = {};
//    Responder.send = function (err, data, res) {
//        if(data===null || data ===undefined){
//            data ={};
//        }
//
//        if (err) {
//
//            res.status(400).send({status:'error',result:err.message});
//        }else{
//            res.status(200).send({status:'success',result:data});
//        }
//    }
//
//    return Responder;
//}

module.exports = function(app) {
    var Responder = {};
    Responder.send = function (code, res, message, data, error_code) {
        if (!code) {
            throw new Error('code is required.');
        }
        res.send(code,{error_code: error_code, message: message,data: data}
        );
    }
    return Responder;
}