var db = {};
var redis = require('redis');
    RDS_PORT = 6379;
    RDS_HOST = '127.0.0.1';
    // RDS_PASS = 'develop';
    RDS_PASS = '';
    RDS_OPTS = {auth_pass:RDS_PASS};

    client = redis.createClient(RDS_PORT, RDS_HOST,RDS_OPTS);

    client.on('error', function(err){
        console.log("ERROR",err);
    });

    client.on('connect', function(){
        console.log('Redis链接成功');
    });


    // client.on('ready', function(err) {
    //     console.log('ready');
    // });

db.set = function(key, value, expires, after){
    // client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
    client.set(key,value,function(err,result){
        if (err) {
            console.log(err);
            after(err,null);
            return;
        }

        if (!isNaN(expires) && expires > 0) {
            client.expire(key,parseInt(expires));
        }
        after(null,result)
    });
}

db.get = function(key, after){
    client.get(key, function(err,result) {
        if (err) {
            console.log(err);
            after(err,null);
            return; 
       }
       after(null, result);
    });
}

db.hset = function (key, field, value ,callback) {
    client.hset(key, field, value, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.hget = function (key, field, callback) {
    client.hget(key, field, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.hgetall = function(key, callback) {
    client.hgetall(key, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null,result);
    });
}

db.blpop = function(key, time, callback) {
    client.blpop(key, time, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.brpop = function(key, time, callback) {
    client.brpop(key, time, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.sadd = function(key, values, callback) {
    var valuestring = values.join(',');
    client.sadd(key, valuestring, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.scard = function(key, callback) {
    client.scard(key, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

db.spop = function(key, callback) {
    client.spop(key, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}
module.exports = db;