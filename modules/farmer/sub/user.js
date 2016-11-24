var user = {};
var redis = require('../../../db/redis');
var querystring = require('querystring');

user.info = function(name, callback) {
    redis.hget('user', name, function(err, result) {
        if (err) {
            callback(1,'获取错误',null);
            return;
        }
        if (result == undefined) {
            callback(2, '未查询到信息',null);
            return;
        }
        var detail = querystring.parse(result);
        detail['name'] = name;
        callback(0,'',detail);
        return;
    })
}

user.hobby = function(name, callback) {
    redis.hget('hobby', name, function(err, result) {
        if (err) {
            callback(1, '内部错误', null);
            return;
        }
        if (result == undefined) {
            callback(0,'暂无爱好',[]);
            return;
        } 
        callback(0,'', querystring.parse(result));
        return;
    })
}



user.addhobbys = function(name, hobbys, callback) {
    var _name = name;
    var _hobbys = hobbys;
    var _callback = callback;
    redis.hget('hobby',_name, function(err1, result1) {
        if (err1) {
            _callback(1, '内部错误', null);
            return;
        }
        if (result1 == undefined) {
            var end1 = new Array();
            end1.push(_hobbys);
            var res2 = querystring.stringify(end1);
                //添加数据，后再存入
                redis.hset('hobby', _name, res2, function(err2, result2) {
                    if (err2) {
                        _callback(1,'添加错误',null);
                        return;
                    }
                    console.log('ok1');
                    _callback(0, '', null);
                    return;
                })
        } else {
            res3 = querystring.parse(result1);
            var end2  = new Array();
            // return;
            for(var i in res3) {
                if (res3[i] == _hobbys) {

                } else {
                    end2.push(res3[i]);
                }
            }
            end2.push(_hobbys);
            console.log(end2);
            res3_end = querystring.stringify(end2);
            redis.hset('hobby', _name, res3_end, function(err3, result3) {
                    if (err3) {
                        _callback(1,'添加错误',null);
                        return;
                    }
                    console.log('ok');
                    _callback(0, '', null);
                    return;
                })
        }

    })
}

module.exports = user;