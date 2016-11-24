var mysql = require('mysql');

var username = "develop";
var password = "654321";
var db_host  = '192.168.0.54';
var db_port  = 3306;
var db_name  = 'fairs_data';


var option = {
    host: db_host,
    port: db_port,
    user: username,
    password: password,
    database: db_name,
};

function _exec(sqls, values, after) {
    var client = mysql.createConnection(option);

    client.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }
        client.query(sqls || '', values || [], function(err, r){
            after(err,r);
        });
        client.end();
    });
    client.on('error', function(err) {
        if (err.errno != 'ECONNRESET') {
            after("err01", false);
            throw err;
        } else {
            after('err02', false);
        }
    })
}

exports.exec = _exec;