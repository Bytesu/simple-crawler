/**
 * Created by s_ on 15/11/15.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Q = require('q');


const sites = require('./fuc/Rules');
console.time('time->');
// console.log(rules)
sites([
    121,//第1章：道路交通安全法律、法规和规章
    122,//第2章：交通信号
    123,//第3章：安全行车、文明驾驶基础知识
    124,//第4章：机动车驾驶操作相关基础知识
    2014,//第5章：交通事故救护常识

    127,//第1章：违法行为综合判断与案例分析
    128,//第2章：安全行车常识
    129,//第3章：常见交通标志、标线和交通手势辨识
    130,//第4章：驾驶职业道德和文明驾驶常识
    131,//第5章：恶劣气候和复杂道路条件下驾驶常识
    132,//第6章：紧急情况下避险常识
    133,//第7章：交通事故救护及常见危化品处置常识
]).forEach(site=>{
    parseSite(site.site,null,site).then(function(res){
        console.log(res.length);
        console.log(res);
        console.timeEnd('time->');
    }).catch(function(e){
        console.log(e);
    });
})

function parseSite(url,prevRes,siteItem) {
    var defer = Q.defer();
    request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var current = siteItem.current_page($);
            if (!isNaN(current)&&current<100) { //
                current = parseInt(current) + 1 ;
                Q.all([
                    parseSite(siteItem.next_page(current),null,siteItem), parsePage($, siteItem.list_item,siteItem)
                ]).then(function(allRes){
                    defer.resolve(allRes[0].concat(allRes[1]));
                });
            }else{
                parsePage($, siteItem.list_item).then(defer.resolve).catch(defer.reject);
            }
        } else {
            defer.reject(error);
        }
    });
    return defer.promise;
}


function parsePage($, site,siteItem) {
    var defer = Q.defer();
    try{
        var arr = [];
        var li = $(site);
        li.each(function (index, ele) {
            try{
                arr.push(siteItem.data_structure($(ele)));
            }catch(e){
                console.log(e)
            }
        });
        defer.resolve(arr);
    }catch(e){
        defer.reject(e);
    }
    return defer.promise;
}
