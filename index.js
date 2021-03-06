/**
 * Created by s_ on 15/11/15.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Q = require('q');


var rules = require('./fuc/Rules');
console.time('time->');
var items = rules[1];
parseSite(items.site).then(function(res){
    console.log(res.length);
    console.log(JSON.stringify(res));
    console.timeEnd('time->');
}).catch(function(e){
    console.log(e);
});
function parseSite(url,prevRes) {
    var defer = Q.defer();
    request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var current = items.current_page($);
            console.log(current);
           
            if (!isNaN(current)&&current<10) { // ""为true
                current = parseInt(current) + 1 ;
                Q.all([parseSite(items.next_page(current)), parsePage($, items.list_item)]).then(function(allRes){
                    defer.resolve(allRes[0].concat(allRes[1]));
                });
            }else{
                parsePage($, items.list_item).then(defer.resolve).catch(defer.reject);
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
        var li = $(site);
        li.each(function (index, ele) {
            try{
                arr.push(items.data_structure($(ele)));
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