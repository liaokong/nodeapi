var express = require('express');
var apibase = require('./modules/apibase');
var db      = require('./db/mysqldb');
var session = require('express-session');
var cookie  = require('cookie-parser');
var seeker = require('./modules/seeker/index');
var company = require('./modules/company/index');
// var agent = require('./modules/agent/index');
var app = express();

//app的中间件是顺序执行的，所以use的顺序非常重要了，

app.use(express.static('public'));
app.use(cookie());
app.use(session({
resave: false,
saveUninitialized:false,
cookie:{maxAge: 8000000},
secret:'jikegz'
}));

//使用 static 中间件来访问静态资源,例如:localhost:8089/static/imgs/index_page.jpg
app.use("/static" , express.static('public'));

// app.use 是中间件，当一个请求来的时候，会一次被这些中间件处理，
// 这个中间件是用来检测用户是否已经登陆了
app.use(function(req, res, next){

    next();
    return;

    if (!req.session.user) {
        var ind = req.url.indexOf("er/login?");
        var ind2 = req.url.indexOf("/index.html");
        //如果页面来自user/login 就执行下去
        if (ind == 3 || ind2 == 0) {
            next();
        }else{
            // res.json(apibase.error(110,'未登录'));
            // return;
            res.redirect('/index.html');
            return;
        }
    }else if (req.session.user) {
     next();   
    }
});

//set方法
app.set('title', '企业后台');



//静态html的文件
app.get('/index.html',function(req, res) {
    res.sendFile(__dirname + "/front/"+"index.html");
})

app.get('/home.html', function(req ,res) {
    res.sendFile(__dirname + "/front/" + "home.html");
})

//服务端接口

app.get('/hello', function(req, res) {
    var ab = ['a','b','c','d','f'];
    // res.json(ab);
    if (ab.length > 9) {
        res.json(apibase.success(ab));
        return;
    } else {
        res.json(apibase.error(901,'hello'));
        return;
    }
    var cd = apibase.success(ab);
    res.json(cd);
});

app.get('/lj/info',function(req, res) {
    var query = req.query;
    var uid = query.uid;
    // var uid = 30;
    console.log(uid);
    seeker.userinfo(uid, function(err, result){
        if (err) {
            res.json(apibase.error(901,'获取信息失败'));
            return;
        }
        res.json(apibase.success(result));
        return;
    })
})

app.get('/my/favorite' , function (req, res) {
    var query = req.query;
    var uid = query.uid;
    seeker.userfav(uid, function(err , result) {
        if (err) {
            res.json(apibase.error(902,'获取喜好错误'));
            return;
        }

        res.json(apibase.success(result));
        return;
    })
})


app.get('/my/company', function(req, res) {
    var query = req.query;
    var uid  = query.uid;
    company.employerinfo(uid, function(err, result) {
        if (err) {
            res.json(apibase.error(901,'错了'));
            return;
        }
        res.json(apibase.success(result));
        return;
    })
})

app.get("/user/info", function(req, res) {
    var query = req.query
    var name = query.name
    // name = '廖军'
    console.log(req.session.user);
    var password = query.password
    db.exec('select * from user where username = "'+name+'"', 1, function(err, result) {
        // res.json(apibase.success(result));
        // return;
        if (err) {
            res.json(apibase.error(901,'查询出错了'));
            return;
        } else {
            if (result[0].groupid == 102) {
                res.json(apibase.success(result[0]));
                return;
            } else {
                res.json(apibase.error(901,'密码错误'));
                return;
            }
        }
    })
})

app.get('/ab*cd', function(req, res){
    res.send(req.query+'正则匹配');
});

app.post('/ab/cd', function(req, res){
    res.send('登陆');
    console.log(req.path+'post请求');
});

app.get('/user/login', function (req, res){
    var info = req.query;
    var username = info.username;
    var password = info.password;
    if (info.username == 'love' && info.password == 'love') {
        var user = {'username':'love'};
        req.session.user = user;

    }


    if (!apibase.isNotNull(username)) {
        res.json(apibase.error(901,'用户名或密码未空'));
        return;
    }
    if (username == password) {
        res.json(apibase.success('登陆成功'));
        return;
    } else {
        res.json(apibase.error(801,'登陆错误'));
        return;
    }
});

app.post('/user/login', function(req, res){
    var info = req.query;
    var username = info.username;
    var password = info.password;
    if (username == password) {
        res.json(apibase.success('登陆成功'));
        return;
    } else {
        res.json(apibase.error(801,'登陆错误'));
        return;
    }
});


app.get('*',function(req, res) {
    res.json(apibase.error(901,'无此页面'))
    return;
})

var server = app.listen(8089, function(){
    var host = server.address().address;
    var port = server.address().port;


    console.log(host, port);
});