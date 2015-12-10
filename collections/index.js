var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var xbiao = mongoose.Schema({
    title: String,
    img:String,
    link:String,
    md5:String,
    price:String,
});

module.exports.Xbiao = mongoose.model('xbiao', xbiao);
