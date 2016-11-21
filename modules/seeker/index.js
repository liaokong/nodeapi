var seeker = {};
var user = require('./sub/user');
seeker.userinfo = function (userid, callback) {
    user.info(userid,callback);
}

seeker.userfav = function (userid, callback) {
    user.favorite(userid, callback);
}

module.exports = seeker;