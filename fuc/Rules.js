/**
 * Created by s_ on 15/11/15.
 */
var tool = require('./tool')
var path = require('path');
//抓取规则
module.exports = [
    {
        site: 'http://cnodejs.org/',
        list_item:'#topic_list .cell',
        next_page:function(current){
            return 'https://cnodejs.org/?tab=all&page='+current;
        },
        data_structure:function(item){
            var site_ = this.site;
            var link = path.join(site_, item.find('.topic_title').attr('href'));
            return {
                href:link,
                text: item.find('.topic_title').text().trim(),
                md5: tool.md5Str(link)
            }
        },
        current_page:function($){
            return $('.pagination').attr('current_page');
        }
    },
    {   
        site: 'http://watch.xbiao.com/',//站点url
        list_item:'#list-pic > ul >li', //抓去最小单元
        next_page:function(page){ // page 列表页
            return 'http://watch.xbiao.com/p'+page+'.html';
        },
        /**
         * 返回需要的数据结构
         */ 
        data_structure:function(item){
            // item.find()
            var link = item.find('div.link > a').attr('href');
            console.log(item.find('div.link > a').text());
            return {
                img:item.find('a > img').attr('src'),
                link:link,
                price:item.find('p.price').html(),
                title:item.find('div.link > a').text(),
                md5:tool.md5Str(link)
            };
        },
        current_page:function($){ //当前页
            return $('.pages').find('.act').html();
        }
    },
];