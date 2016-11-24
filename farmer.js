var express = require('express');
var apibase = require('./modules/apibase');
var db      = require('./db/mysqldb');
var session = require('express-session');
var cookie  = require('cookie-parser');
var farmer = require('./modules/farmer/index');
// var agent = require('./modules/agent/index');
var app = express();

//app的中间件是顺序执行的，所以use的顺序非常重要了，

app.use(express.static('public'));
app.use(cookie());
app.use(session({
resave: false,
saveUninitialized:false,
cookie:{maxAge: 8000000},
secret:'jikegz',
// store:'sessionStorage'
}));

//使用 static 中间件来访问静态资源,例如:localhost:8089/static/imgs/index_page.jpg
app.use("/static" , express.static('public'));

// app.use 是中间件，当一个请求来的时候，会一次被这些中间件处理，
// 这个中间件是用来检测用户是否已经登陆了
app.use(function(req, res, next){

    // next();
    // return;
    console.log(req.session.user);
    
    if (!req.session.user) {
        var ind = req.url.indexOf("er/login?");
        var ind2 = req.url.indexOf("/index.html");
        var ind3 = req.url.indexOf('/user/registe');

        //如果页面来自user/login 就执行下去
        if (ind == 3 || ind2 == 0 || ind3 == 0) {
            next();
        }else{
            // res.json(apibase.error(110,'未登录'));
            // return;
            res.redirect('/index.html');
            return;
        }
    } else {
     next();   
    }
});

//set方法
app.set('title', '企业后台');

app.get('/user/registe' , function(req, res) {
    var info = req.query;
    var userinfo = new Array();
    userinfo['password'] = info.password;
    userinfo['sex'] = info.sex;
    userinfo['headimgurl'] = info.headimgurl;
    userinfo['record'] = info.record;
    farmer.registe(info.name, userinfo, function(code, msg, data) {
        if (code == 0) {
            console.log('注册成功了');
            res.send('成功');
            return;
        } else {
            console.log(msg);
            res.send(msg);
            return;
        }
    })
})


app.get('/user/login', function(req, res) {
    var info = req.query;
    farmer.login(info.name, info.password, function(code, msg, data) {
        if (code == 0) {
            req.session.user = info.name;
            res.send('登陆成功'+info.name);
            return;
        } else {
            console.log(msg);
            res.send(msg);
            return;
        }
    })
})

app.get('/user/addhobby', function(req, res) {
    var hobby = req.query;
    var myhobby = hobby.hobby;
    // var name = 'abc';
    farmer.addhobby(req.session.user, myhobby, function(code, msg, data) {
        if (code == 0) {
            res.json(apibase.success('添加成功'));
        } else {
            res.json(apibase.error(801,msg));
            return;
        }
    })
})


app.get('/user/myhobby', function(req, res) {
    farmer.userhobby(req.session.user, function(code, msg, data) {
        if (code == 0) {
            res.json(apibase.success(data));
            return;
        }
        res.json(apibase.error(801,msg));
        return;
    })
})

app.get('/dev/test', function(req,res) {
    res.end(req.session.user);
})

//静态html的文件
app.get('/index.html',function(req, res) {
    res.sendFile(__dirname + "/front/"+"index.html");
})

app.get('/home.html', function(req ,res) {
    res.sendFile(__dirname + "/front/" + "home.html");
})

//服务端接口

app.get('/user/info', function(req, res) {
    var name = req.session.user;
    farmer.userinfo(name, function(code, msg, data) {
        if (code !=0 ) {
            res.send(msg);
            return;
        }

        res.json(apibase.success(data));
        return;
    })
})



app.get('*',function(req, res) {
    res.json(apibase.error(901,'无此页面'))
    return;
})

var server = app.listen(8090, function(){
    var host = server.address().address;
    var port = server.address().port;


    console.log(host, port);
});