<template>
    <div class="container">
        
        <div class="userInfo" @click="refreshInfo">
           <image :src="avatar" alt=""></image>
           <p>{{nickName}}</p>
           <year-progress></year-progress>
           <button class="btn" v-if="jurge" @click="getDoubanbookinfo">扫码找书</button>
        </div>
        <button class="login-btn" v-if="btnHidden" open-type="getUserInfo"  @getuserinfo="onGotUserInfo"></button>
        <div v-for="(item,index) in bookList" :key = index>
            <van-card 
                :num= "item.collect_count"
                desc="测试数据"
                :title= "item.title"
                :thumb= "item.images.medium">
                    <view slot="tags">
                        <div style="display:inline-block;margin-right:5px;" v-for="(tagItem,tagIndex) in item.genres" :key="tagIndex">
                            <van-tag >{{tagItem}}</van-tag>
                        </div>
                    </view>
                    <view slot="footer">
                        <van-button style="margin-right:5px;"  size="mini" type="info" @click="viewItem(item._id)">查看详情</van-button>
                        <van-button size="mini" type="danger" @click="delBook(item._id)">删除</van-button>
                    </view>
            </van-card>
        </div>

    </div>
</template>

<script>
import { showSuccess } from '@/util'
import YearProgress from "@/components/YearProgress"
export default {
    data(){
        return {
            openId :'',
            avatar: '../../../../../static/img/unlogin.png',
            nickName: '点击头像刷新',
            bookList: {},
            btnHidden: false,
            jurge: false
        }
    },
    watch:{
        bookList: function (nlist,olist) {
            console.log('123');
            
        }
    },
    
    components: {
        YearProgress
    },
    created() {
        const db = wx.cloud.database({ env: 'qirito-6049e8' });
        const _this = this;
        if(!wx.getStorageSync('userInfo')){
            this.btnHidden = true;
        }
        db.collection('mybook').get({
            success: res => {
                _this.bookList = res.data;
            }
        })
        
    },
    mounted() {
        
    },
    updated() {
        
    },
    methods: {
        // 获取openid
        onGotUserInfo(e){
            if(e){
                var data = {};
                data = JSON.parse(e.mp.detail.rawData);
                wx.setStorageSync('userInfo', data);
                this.btnHidden = false;
                this.refreshInfo();
            }
        },
        refreshInfo(){
            if(this.jurge == false){
                this.avatar = wx.getStorageSync('userInfo').avatarUrl;
                this.nickName = wx.getStorageSync('userInfo').nickName;
                this.openId = wx.getStorageSync('openInfo').result.openid;
                this.jurge = true;
                setTimeout(()=>{
                    showSuccess('登录成功');
                },500)
            }else if(this.jurge == true){
                return
            }
        },
       
        // 扫码获取图书信息
        // scanBook(){
        //     wx.scanCode({
        //         success: (res) => {
        //             console.log('scanCode :', res);
        //         }
        //     })
        // },
        getDoubanbookinfo(){
            // 假设movidd是前端接口返回得到的数据 例如wx.scanCode的res
            // 因为豆瓣图书接口好像炸了，所以用了个电影的接口，但因为查询要的是id，而不是IMDb，所以只能找个现成的
            let movidd = 27622447;
            let _this = this;
            const db = wx.cloud.database({ env: 'qirito-6049e8' });
            wx.cloud.callFunction({
                name: "getDoubanbookinfo",
                data: {
                    movid : movidd
                },
                success: res =>{
                    // console.log('res :', res);
                    var bookString = res.result;
                    const db = wx.cloud.database({ env: 'qirito-6049e8' });
                    const book = db.collection('mybook')
                    book.add({
                        data: JSON.parse(bookString)
                    }).then(res =>{
                        console.log('add',res)
                        db.collection('mybook').get({
                        success: res => {
                                // console.log(_this.bookList)
                                _this.bookList = res.data
                            }
                        })
                    }).catch(err => {
                        console.log('adderr :', err);
                    })
                },
                fail: err =>{
                    console.error(err)
                }
            });
            
        },
        viewItem(event){
            // var id = event.currentTarget.dataset.id;
            // wx.switchTab({
            //     url:'../books/main'
            // })
            wx.navigateTo({
                url:'../allbook/main?_id='+event
            })
        },
        delBook(id){
            console.log('data id',id)
            const db = wx.cloud.database({ env: 'qirito-6049e8' });
            const _this = this;
            db.collection('mybook').doc(id).remove({
                success(res) {
                    // console.log(res.data)
                    db.collection('mybook').get({
                    success: res => {
                            // console.log(_this.bookList)
                            _this.bookList = res.data
                        }
                    })
                }
            })
        }
    },
}
</script>

<style lang="scss">
.hidden{
    display: none;  
}
.ncard{
    max-width:250px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;

}
.container{
    padding: 0 30rpx;
    .userInfo{
        margin-top: 100rpx;
        text-align: center;
        image{
            width: 128rpx;
            height: 128rpx;
            margin: 20rpx;
            border-radius: 50%
        }
        p{
            margin-bottom: 10px;
        }
        .btn{
            font-size: 28rpx;
            color: #ffffff;
            background-color: #ff5577;
        }
    }
    .login-btn{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0);
        z-index: 1000;
    }
    
}
</style>
