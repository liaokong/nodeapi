var db = require('./db/redis');

db.set('abc', '123444','233', function(err,result){
    if (err) {
        console.log('插入失败');
        return;
    }
    // console.log('ok');
    console.log('result',result);
});

db.get('abc', function(err, result){
    if (err) {
        console.log('获取失败');
        return;
    }
    console.log('result',result);

})

