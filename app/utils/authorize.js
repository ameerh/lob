/**
 * Created by hassan on 6/3/15.
 */

module.exports  = function(app){

    var exceptions = ['/signin'];

    var Authorize = {
        authorize : function(req, res, next) {
            if(req.user && req.user.value.role == "admin"){
                next()
            }
            else if (exceptions.indexOf(req.url)>-1){
                next()
            }
            else{
                res.send({"msg": "Unauthorized Access"});
            }
        }
    };
    return Authorize;
};