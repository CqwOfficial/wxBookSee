import Vue from 'vue'
import App from './App'
// import { Card } from 'vant';


Vue.config.productionTip = false
App.mpType = 'app'
// Vue.use(Card);
wx.cloud.init({
    env: 'qirito-6049e8',
    traceUser:true
})

const app = new Vue(App)
app.$mount()
