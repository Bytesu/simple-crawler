/**
 * Created by s_ on 15/11/15.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Q = require('q');
var path = require('path');


var rules = require('./fuc/Rules');
var tool = require('./fuc/tool');
//crawler();
var test = {};
function crawler() {
    console.log(rules);
    rules.forEach(function (site) {
        //var url = site.site;
        //console.log(site)
        //request(url).pipe((fs.createWriteStream('suren.html')));
        //    parseSite(site);
        request(site.site, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                console.log('AAAA')
                //console.log(site.page.total($));
                var $ = cheerio.load(body);
                var current = $('.pagination').attr('current_page');
                //console.log($.html())

                if (!isNaN(current)) {
                    console.log(current)
                }
                
                console.log(current);
                console.log('AAA');

                //var i = 1;
                //while (i <= site.page.total($)) {
                //    //parsePage($, site);
                //    console.log(path.join(site.site,site.page.current($,i)));
                //    i++;
                //}
            }
        })
    });
}
// console.time('time->');

parseSite('http://cnodejs.org/').then(function(res){
    console.log(res.length);
    console.timeEnd('time->');
}).catch(function(e){
    console.log(e);
});
function parseSite(url,prevRes) {
    var defer = Q.defer();
    request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var current = $('.pagination').attr('current_page');
            console.log(current)
            //if(current){
            //    defer.resolve([]);
            //}else
            if (!isNaN(current)&&current) { // ""为true
                current = parseInt(current) + 1 ;
                Q.all([parseSite('https://cnodejs.org/?tab=all&page='+current), parsePage($, rules[0])]).then(function(allRes){
                    defer.resolve(allRes[0].concat(allRes[1]));
                });
            }else{
                parsePage($, rules[0]).then(defer.resolve).catch(defer.reject);
            }
        } else {
            defer.reject(error);
        }
    });
    return defer.promise;
}


function parsePage($, site) {
    var defer = Q.defer();
    try{
        var arr = [];
        var li = $(site.item.url);
        li.each(function (index, ele) {
            //console.log(($(ele).html()))
            var text = $(ele).find('.topic_title').text().trim();
            var href = $(ele).find('.topic_title').attr('href');
            //console.log(site.site, href)
            var obj = {
                href: path.join(site.site, href),
                text: text,
                md5: tool.md5Str(path.join(site.site, href))
            };
            test[tool.md5Str(obj.href)] = obj;
            //console.log(JSON.stringify(obj));
            console.log(text)
            arr.push(obj);
        });
        defer.resolve(arr);
    }catch(e){
        defer.reject(e);
    }

    //console.log(Object.keys(test).length)
    //console.log("arr:", arr.length);
    return defer.promise;
}