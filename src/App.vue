<script>
// import { showSuccess } from './util'
export default {
  data(){
    return {
    }
  },
  created() {
    let open = wx.getStorageSync('openInfo');
    if(!open){
      this.getOpenid();
    }
  },
  mounted() {

    // db.collection('apex').get({
    //   success(res){
    //     console.log('res.data :', res.data);
    //   }
    // });

    
  },
  methods: {
    getOpenid(){
      wx.cloud.callFunction({
          name: "getOpenid",
          complete: res => {
              wx.setStorageSync('openInfo', res);
          }
      })
    },
  },
}
</script>

<style></style>
