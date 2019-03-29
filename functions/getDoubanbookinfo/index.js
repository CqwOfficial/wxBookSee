const rp = require('request-promise')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event :', event);
  // return event.movid
  var res = rp('https://api.douban.com/v2/movie/subject/'+event.movid).then(html => {
    return html;
  }).catch(err => {
    console.log('err :', err);
  })
  return res
}