var db = require('../../../db/mysqldb');
var user = {};
user.info = function(uid,callback) {
    db.exec('select * from user where id = '+uid, function(err, result) {
        if(err) {
            callback(err, null);
        }
        callback(null, result);
    })
}

user.favorite = function(uid, callback) {
    db.exec('select * from user where id = 30' ,function(err, result) {
        if (err) {
            callback(err, null);
        }
        //在这处理完成后，给回调函数使用
        result = result[0];
        result.groupid = 'hello word';
        result.sex = 'boy';
        result.wage = 10000;
        callback(null, result);
    })
}

module.exports = user;