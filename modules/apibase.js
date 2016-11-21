var session = require('express-session');
var cookie  = require('cookie-parser');
var apis = {};

apis.success = function(data) {
    var resu = {'errcode':0,'message':'','data':data};
    return resu;
}

apis.error = function(code, msg) {
    var resu = {'errocde':code,'message':msg,'data':'' };
    return resu;
};

apis.isNotNull = function(data) {
    return (data == "" || data == null || data == undefined) ? false : true;
};

apis.isLogin = function(req, callback){
    if (!req.session.user) {
        callback(true,res,req);
    } else {
        callback(false, res, req);
    }
}


module.exports = apis;