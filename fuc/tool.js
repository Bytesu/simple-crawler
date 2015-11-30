/**
 * Created by s_ on 15/11/16.
 */
var crypto = require('crypto');

exports.md5Str = function (arg) {

    var shasum = crypto.createHash('md5');
    shasum.update(arg);
    var d_ = shasum.digest('hex');
    //console.log(d_ + '  ');
    return d_;
};



