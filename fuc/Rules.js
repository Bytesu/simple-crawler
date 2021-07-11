/**
 * Created by s_ on 15/11/15.
 */
var tool = require('./tool')
var path = require('path');
var model = require('../collections/')
const cleanTextFn = (text)=>{
    return (text||'').replace(/[（）?？,，。.0-9;；、】【'"‘“’”]/ig,'') //
        .replace(/\s+/g, "") //空格
        .replace(/_+/g, "") //下划线
        .replace(/_+/g, "")
}
const sites = (list) => {
    return list.map(currentPage => {
        return {
            site: 'https://www.jiakaobaodian.com/tiku/chapter/'+currentPage+'.html',//站点url
            list_item: 'ul.list-w > li', //抓去最小单元
            next_page: function (page) { // page 列表页
                return 'https://www.jiakaobaodian.com/tiku/chapter/'+currentPage+'.html?page=' + page;
            },
            /**
             * 返回需要的数据结构
             */
            data_structure: function (item) {
                var title = item.find('div.timu > p > a')[0].children[0].data;
                /**
                 * @todo 匹配序号
                 * @type {string}
                 */
                title = cleanTextFn(title);
                console.log(title);
                let texts = [];
                let answer = '';
                item.find('.answer-w > .options-w > p').map((index, ele) => {
                    let item = ele.children[0].data;
                    if (ele.attribs['data-right'] === 'true') {
                        answer = item
                    }
                    texts.push(item);
                });
                let dataStr = [cleanTextFn(title), texts.map(item=>cleanTextFn((item))).sort()].flat();
                // console.log(dataStr)
                let md5 = tool.md5Str(dataStr.join('').replace('。'));
                const recordData = {
                    answers: texts,
                    title,
                    answer,
                    md5
                };
                model.Tests.findOne(
                    {md5},
                    'title answer',
                    function (error, record) {
                        if (!error) {
                            if (!record) {
                                new model.Tests(recordData).save(function (err, res) {
                                    if (!err) {
                                        // console.log(`save success`);
                                    } else {
                                        throw new Error('Test ing !')
                                    }
                                });
                            } else {
                                // console.log(`query the same data, dataStr is : ` + dataStr)
                                // console.log(`query the same data, answer is : ` + record._doc.answer)
                            }
                        } else {
                            console.log(error)
                        }
                    })


                return 1;
            },

            current_page: function ($) { //当前页
                return $('.common-paging').find('.active').html();
            }
        }
    })

};
//抓取规则
module.exports = sites;
