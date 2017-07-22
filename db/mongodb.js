var mongo = {};
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');

var options = {
    db_user:'liaojun',
    db_pwd:'liaojun',
    db_host:'12.12.12.12',
    db_port:20017,
    db_name: 'helloword'
};
// var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
var dbURL = "mongodb://12.12.12.12:20017/abcz";
// var dbURL = 'mongodb://localhost:27017/abcde';
mongoose.connect(dbURL);

mongoose.connection.on('connected', function (err) {
    if (err) {
        console.log('mongo db 链接失败');
        return;
    }
    console.log('mongo db 链接成功');
    return;
});

mongoose.connection.on('error',function(err) {
    if (err) {
        console.log('Mongooes connection error ' + err);
    }
});

mongoose.connection.on('disconnected', function() {
    console.log('断开链接');
})
process.on('SIGINT', function() {
    mongoose.connection.close(function(){
        console.log('系统消息');
        process.exit(0);
    })
})

var DB = function () {
    this.mongoClient = {};
    var filename = path.join(path.dirname(__dirname).replace('apps', ''), 'config/table.json');
    this.tabConf = JSON.parse(fs.readFileSync(path.normalize(filename)));
    // console.log(this.tabConf['online_data']);

}

DB.prototype.getConnection = function(table_name)
{
    if (!table_name) return;
    var client = this.mongoClient[table_name];
    if (!client) {
        var nodeSchema = new mongoose.Schema(this.tabConf[table_name]);
        client = mongoose.model(table_name, nodeSchema, table_name);
        this.mongoClient[table_name] = client;
    }
    return client;
};

DB.prototype.save = function(table_name, fields, callback){
    if (!fields) {
        if (callback) {
            callback(true, null);
            return false;
        }
    }
    var err_num = 0;
    for (var i in fields) {
        if (!this.tabConf[table_name][i]) {
            err_num ++;
        }
    }
    if (err_num > 0) {
        if (callback) {
            callback(true, null);
            console.log('field 名称错误');
            return false;
        }
    }
    var node_module = this.getConnection(table_name);
    var mongooseEntity = new node_module(fields);
    mongooseEntity.save(function (err, result) {
        if (err) {
           if (callback) callback(err, null);
        } else {
           if (callback) callback(null, result);
        }
    });
};
/**
table_name string
conditions {}
update_fields {}
callback func
这个方法是更新多条的，符合条件的数据
**/
DB.prototype.update = function (table_name, conditions, update_fields, callback) {
    if (!update_fields || !conditions) {
        if (callback) callback(true, null);
        return;
    }
    var node_model = this.getConnection(table_name);
    node_model.update(conditions, {$set: update_fields}, {multi: true, upsert: true}, function (err, res) {
        if (err) {
            if (callback) callback(err,null);
        } else {
            if (callback) callback(null, res);
        }
    });
};
/**
table_name string
condition {}
callback func
只查询符合条件的第一条
**/
DB.prototype.findOne = function (table_name, conditions, callback) {
    var node_model = this.getConnection(table_name);
    node_model.findOne(conditions, function (err, res) {
        if (err) {
            callback(err,null);
        } else {
            callback(null, res);
        }
    });
};

/**
table_name string
conditions {}
update_fields {}
callback func
更新第一条符合条件的数据
**/
DB.prototype.updateData = function (table_name, conditions, update_fields, callback) {
    if (!update_fields || !conditions) {
        if (callback) callback(true, null);
        return;
    }
    var node_model = this.getConnection(table_name);
    node_model.findOneAndUpdate(conditions, update_fields, {multi: true, upsert: true}, function (err, data) {
        if (callback) callback(err, data);
    });
};

DB.prototype.remove = function (table_name, conditions, callback) {
    var node_model = this.getConnection(table_name);
    node_model.remove(conditions, function (err, res) {
        if (err) {
            if (callback) callback(true, null);
        } else {
            if (callback) callback(null, res);
        }
    });
};

/**
table_name 是集合名词
conditions {} 对象，条件,and or,参照mongo文档
fields 对象，查询那些文档，默认全部，就是那些列
callback 会调函数
sort 可以不传递，默认，{'title':-1, 'smalltitle':1} -1降序 1升序
limit number 限制条数 ，默认全部
skip 偏移量，默认为0
*/
DB.prototype.find = function (table_name, conditions, fields, callback) {
    var node_model = this.getConnection(table_name);
     node_model.find(conditions, fields || null, {}, function (err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        })
};

DB.prototype.findById = function (table_name, _id, callback) {
    var node_model = this.getConnection(table_name);
    node_model.findById(_id, function (err, res){
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};


DB.prototype.count = function (table_name, conditions, callback) {
    var node_model = this.getConnection(table_name);
    node_model.count(conditions, function (err, res) {
        if (err) {
            callback(err,null);
        } else {
            callback(null, res);
        }
    });
};

DB.prototype.distinct = function (table_name, field, conditions, callback) {
    var node_model = this.getConnection(table_name);
    node_model.distinct(field, conditions, function (err, res) {
        if (err) {
            callback(err,null);
        } else {
            callback(null, res);
        }
    });
};

DB.prototype.where = function (table_name, conditions, options, callback) {
    var node_model = this.getConnection(table_name);
    node_model.find(conditions)
        .select(options.fields || '')
        .sort(options.sort || {})
        .limit(options.limit || {})
        .exec(function (err, res) {
            if (err) {
                callback(err,null);
            } else {
                callback(null, res);
            }
        });
};


module.exports = new DB();