var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = "Ntuji_bocV-ceuZDlzho-AHvUl6KGNeUreX5jvkQ";
qiniu.conf.SECERT_KEY = "wLnOJdIKPAVuDxGDFrBFhy3eQOYw9kgK7QFwK_t2";
bucket = "xiaoqu-space-liaojun";
key = "test.png";

function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}