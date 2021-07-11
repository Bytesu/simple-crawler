var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var xbiao = mongoose.Schema({
    title: String,
    img:String,
    link:String,
    md5:String,
    price:String,
});
var tests = mongoose.Schema({
    title: String,
    answer:String,
    answers:Array,
    md5:String,
});
/**
 * 账户层级
 * @type {{LEVEL_1: string, LEVEL_2: string, LEVEL_3: string}}
 */
const AccountLevel = {
    LEVEL_1:`1`, //一级用户
    LEVEL_2:`2`, //二级用户
    LEVEL_3:`3`, //三级用户
}
//账户关系
var accountRelation =  mongoose.Schema({
    targetId: 'string', level: 'string'
});
/**
 * 充值记录
 */
var history =  mongoose.Schema({
    type:String, //类型：充值和佣金
    percent:Number,
    cash:Number,//充值金额、佣金金额
    consumer_id:String, //消费用户
    owner_id:String,//上级用户
});

const users = mongoose.Schema({
    nickName:String,
    phone:String,
    password:String,
    account:accountRelation,//下级会员
    history:history, // 充值记录
    valid_count:Number,//当前可用查询次数
    avatar:String,//微信头像
    wx_id:String,//
    open_id:String,//
    commission:history,//佣金
})

module.exports.Users = mongoose.model('users', users);
module.exports.Tests = mongoose.model('tests', tests); //测试题
