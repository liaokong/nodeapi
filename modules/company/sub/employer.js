var employer = {};
var db = require('../../../db/mysqldb');
employer.info = function(uid, callback) {
    db.exec('select * from user where id = '+uid, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        //处理数据问题
        var myresult = {};
        myresult.id = 1;
        myresult.fav = 20;
        myresult.company = '中华人民共和国';
        callback(null, myresult);
    })
}

module.exports = employer;