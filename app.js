//app.js
App({
   onLaunch: function (ops) {
      //判断是否是从二维码进来
      this.globalData.scene = ops.scene;
      if (ops.scene == 1011 || ops.scene == 1012 || ops.scene == 1013) {
         this.globalData.fromCodeFlag = true;
      }
      console.log("=============app.onlaunch===============");
      //调用API从本地缓存中获取数据
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
   },

   onHide: function () {
      wx.pauseBackgroundAudio();
   },
   onShow: function (ops) {
      //调用API从本地缓存中获取数据
      console.log("=============app.onShow===============");
      if (ops.shareTicket != null && ops.shareTicket != '' && ops.shareTicket != undefined) {
         this.globalData.shareTicket = ops.shareTicket;
      }
      console.log("-=====app.globalData.shareTicket:" + this.globalData.shareTicket + "|ops.shareTickets:" + ops.shareTicket);
      //判断是否截过频
      var ban = wx.getStorageSync("ban");
      if (ban == "true") {
         wx.reLaunch({
            url: '/pages/index/index?closeFlag=1',
         })
      }

   },
   getUserInfo: function (cb) {
      var that = this
   },
   getHeighestScore: function (cb) {
      this.globalData.heighestScore = wx.getStorageSync("heighestScore");
      typeof cb == "function" && cb(this.globalData.heighestScore)
   },
   globalData: {
      userInfo: null,
      heighestScore: 0,
      systemInfo: null,
      zhuan: 0,
   }
})