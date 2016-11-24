var farmer = {};
var user = require('./sub/user');
var redis = require('../../db/redis');
var querystring = require('querystring');

//用户登陆的接口
farmer.login  = function (name, password, callback) {
    redis.hget('user', name, function(err, result) {
        if (err) {
            callback(1,"链接服务出错，请稍后", null);
            return;
        }

        if (result == undefined) {
            callback(3, '无此用户',null);
            return;
        }

        var info = querystring.parse(result);
        if (info.password != password) {
            callback(2, "密码不正确", null);
            return;
        } else {
            callback(0, "login success ", null);
            return;
        }
    } )
}

//用户注册接口
farmer.registe = function (name, userinfo, callback) {
    redis.hget('user', name , function(err, result) {
        if (err) {
            callback(3,'链接服务出错，请稍后',null);
            return;
        }
        if (result == undefined) {
           end_info = querystring.stringify(userinfo);
            redis.hset('user', name, end_info, function(err, result) {
                if (err) {
                    callback(2,'注册失败，请稍后再试',null);
                    return;
                } else {
                    callback(0,'注册成功',null);
                    return;
                }
            })
        } else {
            callback(1, '用户名已经被注册了',null);
            return;
        }
    })
}

farmer.userinfo = function(name, callback) {
    user.info(name, callback);
}

farmer.addhobby = function(name, hobby, callback) {
    user.addhobbys(name, hobby, callback);
}


farmer.userhobby = function(name, callback) {
    user.hobby(name, callback);
}

module.exports=farmer;
// exports.farmer = farmer;