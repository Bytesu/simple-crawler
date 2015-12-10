/**
 * Created by s_ on 15/11/15.
 */
module.exports = [
    {
        site: 'http://cnodejs.org/',
        page: {
            total: function($){
                var url  = $('.pagination li').last().find('a').attr('href');
                //console.log($('.pagination li:last a'))
                //.last().find('a').attr('href')
                //url = '/?tab=all&page=365';
                return parseInt(url.slice(url.lastIndexOf('=')+1-url.length));
            },
            start:function($){
                return parseInt($('.pagination li:first a').attr('href').slice(-1));
            },
            current:function($,num){
                var url  = $('.pagination li').last().find('a').attr('href');
                // console.log('AAAA')
                console.log((url.slice(0,url.lastIndexOf('=')+1-url.length)+num))
                return (url.slice(0,url.lastIndexOf('=')+1-url.length)+num);
            }
        },
        item:{
            url:'#topic_list .cell'
        }
    },
    {   
        site: 'http://watch.xbiao.com/',
        list_item:'#list-pic > ul >li',
        next_page:function(page){ // page 列表页
            return 'http://watch.xbiao.com/p'+page+'.html';
        },
        match_title:function($,ele){//标题
            return $(ele).find('div.link > a').text();
        },
        match_link:function($,ele){ //链接
            return $(ele).find('div.link > a').attr('href');
        },
        current_page:function($){
            return $('.pages').find('.act').html();
        }
    },
];