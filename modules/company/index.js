var company = {};
var employer = require('./sub/employer');

company.employerinfo = function (uid, callback) {
    employer.info(uid,callback);
}

module.exports = company;