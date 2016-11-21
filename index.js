var url = require('url');
var http = require('http');
var sql = require('./db/mysqldb');
http
    .createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain;charset=utf8'})
        res.write('hello word')
        var args = url.parse(req.url, true).query;
        console.log(typeof(args));
        console.log(args.hell);
        var _self = {};
        var a = '';
        sql.exec('select * from agent ', '1',function(err, rows){
            console.log('结果', rows.name);
            // self.a = typeof(rows);
            a = rows[0].name;
            res.write(a);
            res.end();
        });
    })
    .listen(8901);