<template>
    <div>
        <img :src="bookData.img" alt="">
        <div class="tag">{{bookData.who}}</div>
        <div class="mian-fram">{{bookData.summary}}</div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            bookData:{
                img:"",
                who:"",
                summary:''
            }
        }
    },
    // onLoad(options){
    //     this.oid = options.id
    //     const db = wx.cloud.database({ env: 'qirito-6049e8' });
    //     db.collection('mybook').doc(options.id).get({
    //         success: res=>{
    //             console.log('res.data :', res.data);
    //         }
    //     })
    // },
    created() {
    },
    mounted() {
        const _this = this;
        const db = wx.cloud.database({ env: 'qirito-6049e8' });
         db.collection('mybook').doc(this.$root.$mp.query.id).get({
            success: res=>{
                console.log(res.data)
                _this.bookData.img = res.data.images.medium;
                _this.bookData.who = res.data.title;
                _this.bookData.summary = res.data.summary;
            }
        })
    },
}
</script>

<style lang="scss">
img{
    margin: 10rpx 0 0 10rpx;
    width: 150rpx;
    height: 250rpx;
}
.tag{
    display: inline-block;
    margin-left: 50rpx;
    font-weight: 500;
    border-radius: 25% 25%;
    color: #ffffff;
    background-color: gray;
}
.mian-fram{
    padding: 10rpx;
    text-indent:60rpx;
}
</style>
