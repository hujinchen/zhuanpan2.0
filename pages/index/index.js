// pages/index/index.js
var util = require('../../utils/util.js')
var app = getApp();

var xiaojuedingArr = require('../../utils/xiaojueding.js')
wx.setStorageSync('all', xiaojuedingArr);
wx.setStorageSync('num', 100);

function randomsort(a, b) {
   return Math.random() > .5 ? -1 : 1;
}

var page = {
   data: {
      size:{ //转盘大小可配置
         w:599,
         h:600
      },
      musicflg: true,
      fastJuedin: false,
      repeat: false,
      xiaojuedingArr: xiaojuedingArr.sort(randomsort),
      s_awards: '？',//结果

      share: true,


      //画布--------------------------------
      canvasWidth: 400,
      canvasHeight: 650,
      showCanvasFlag: false,

      colorArr: [
         '#EE534F',
         '#FF7F50',
         '#FFC928',
         '#66BB6A',
         '#42A5F6',
         '#5C6BC0',
         '#AA47BC',
         '#EC407A',
         '#FFB6C1',
         '#FFA827'
      ],
      fontArr: ['italic', 'oblique', 'normal'],
      sizeArr: [12, 14, 16, 18, 20, 22, 24, 26, 28],

      eweimaUrl: '../../images/erweima.jpg',

      shengchengUrl: '',

      saveFrameFlag: false,

   },

   //接收当前转盘初始化时传来的参数
   getData(e){
      this.setData({
         awardsConfig: e.detail,
      })
   },

   //接收当前转盘结束后的答案选项
   getAwards(e) {
      this.setData({ 
         s_awards: e.detail.end ? "？" : e.detail.s_awards,
         share: e.detail.end ? true : false,
      })
   },

   //开始转
   startZhuan(e) {
      this.setData({
          zhuanflg: e.detail ? true : false
      })
   },

   onLoad: function (options) {
      console.log('=========onload============');
      this.zhuanpan = this.selectComponent("#zhuanpan");
   },

   //点击切换转盘选项
   xiaojueding(e) {
      var that = this, idx = e.currentTarget.dataset.idx, xiaojuedingArr = that.data.xiaojuedingArr;
      
      if (!that.data.zhuanflg) {
         for (let x in xiaojuedingArr) {
            if (idx == x && xiaojuedingArr[x].option != that.data.awardsConfig.option) {
               that.zhuanpan.switchZhuanpan(xiaojuedingArr[x]);//切换当前转盘数据选项 
               return;
            }
         }
      }
   },

   onShow: function (e) {
      console.log('============onShow============');
      var that = this, switchTab = wx.getStorageSync('switchTab'), all = wx.getStorageSync('all'), xiaojuedingArr = that.data.xiaojuedingArr;

      //判断从热门小决定 还是个人小决定跳转过来的 还是编辑页面跳过来的
      all = app.globalData.defaultJueding ? xiaojuedingArr : app.globalData.myJueding ? all : xiaojuedingArr;
      
      that.setData({
         musicflg: !app.globalData.musicflg ? true : false,
         fastJuedin: app.globalData.juedin ? true : false,
         repeat: app.globalData.repeat ? true : false,
      })
      
      //跳转过来的
      if (!util.isNull(switchTab)) {
         
         wx.showLoading({
            title: '加载中',
         })
         switchTab = switchTab == '00' ? '0' : switchTab;
         setTimeout(function () {
            for (let i in all) {
               if (all[i].id == switchTab) {
                  that.zhuanpan.switchZhuanpan(all[i], true);//切换当前转盘数据选项 
                  that.setData({
                     zhuanflg:false
                  })
                  break;
               }
            }
            wx.hideLoading();
         }, 500)
      }
   },

   //关闭保存图片的框
   closeSaveFrame: function () {
      var that = this;
      that.zhuanpan.reset();
      that.setData({
         saveFrameFlag: false,
      });
   },

   //保存图片
   saveImage: function () {
      var that = this;
      var filePath = that.data.shengchengUrl;

      wx.saveImageToPhotosAlbum({
         filePath: filePath,
         success: function (res) {
            wx.showToast({
               title: '保存图片成功！',
               icon: 'none',
               duration: 1000,
               mask: true,
            })
         }
      })
   },

   //分享到朋友圈
   generate() {
      wx.showLoading({
         title: '正在生成中',
      })

      var that = this;
      that.setData({
         showCanvasFlag: true,
      })

      var textArr = [];
      for (var i = 0; i < that.data.awardsConfig.awards.length; i++) {
         textArr.push(that.data.awardsConfig.awards[i].name);
      }


      that.makeImageCanvas('shareCanvas', that.data.awardsConfig.option, textArr, that.data.colorArr, that.data.fontArr, that.data.sizeArr, 600, 20, 20, 40, that.data.canvasWidth, that.data.canvasHeight, 120, 400, that.data.eweimaUrl);

      setTimeout(function () {
         wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.canvasWidth,
            height: that.data.canvasHeight,
            canvasId: 'shareCanvas',
            success: function (res) {
               console.log(res.tempFilePath);

               that.setData({
                  showCanvasFlag: false,
                  saveFrameFlag: true,
                  shengchengUrl: res.tempFilePath,
               })

               wx.hideLoading();
            }
         })
      }, 2000)

   },

   onShareAppMessage: function () {
      let that = this;
      mta.Event.stat("share", { 'time': '1' });
      var picNum = Math.floor(Math.random() * 4 + 1);//获取1-4的随机数，用于随机展示分享图片

      return {
         title: util.isNull(app.globalData.shareTitle) ? ("一起来玩'" + app.globalData.title + "'吧") : app.globalData.shareTitle,
         path: '/pages/index/index',
         success: function (res) {
            console.log('成功进入分享==========', res);

         },
         fail: function (res) {
            console.log('进入分享失败==========', res);
         }
      }
   },

   //画图--画布:canvasName画布ID名，title标题，textArr内容数组，colorArr字体颜色数组，fontArr字体样式数组，sizeArr字体大小数组，num总数量，rowNum一行数量--最大为5，distance同行中词的距离，spacing第二行与第一行隔多少距离，canvasWidth画布宽度，canvasHeight画布高度，midWidth中间宽度，midHeight中间高度，imgUrl二维码图片路径
   makeImageCanvas: function (canvasName, title, textArr, colorArr, fontArr, sizeArr, num, rowNum, distance, spacing, canvasWidth, canvasHeight, midWidth, midHeight, imgUrl) {
      var that = this;

      var contentArr = [];
      for (var a = 0; a < num; a++) {
         var neirong = that.arrayRandomTakeOne(textArr);//内容
         contentArr.push(neirong);
      }
      //console.log(contentArr);

      const ctx = wx.createCanvasContext(canvasName)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)//清除画布区域内容
      ctx.setFillStyle('white')//填充背景色--白色
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      var daxiaoArr = [];
      for (var i = 0; i < contentArr.length; i++) {
         var hang = parseInt(i / rowNum) + 1;//第几行
         var hangDj = i % rowNum;//每行第几
         var yanse = that.arrayRandomTakeOne(colorArr);//颜色
         var ziti = that.arrayRandomTakeOne(fontArr);//字体
         var daxiao = that.arrayRandomTakeOne(sizeArr);//大小
         daxiaoArr.push(daxiao);
         //console.log(yanse, ziti, daxiao);

         var rowStart = 0;//水平起点
         var columnStart = hang * spacing;//竖直起点

         if (hangDj == 0) {
            rowStart = 0;
         }
         else if (hangDj > 0) {
            for (var e = 1; e < hangDj + 1; e++) {
               rowStart = rowStart + contentArr[i - e].length * daxiaoArr[i - e];
            }
            rowStart = rowStart + distance * hangDj;
         }
         //console.log('起点', rowStart);

         ctx.fillStyle = yanse;//字体颜色
         ctx.font = ziti + ' small-caps normal ' + daxiao + 'px Arial';
         ctx.fillText(contentArr[i], rowStart, columnStart)
      }

      ctx.setFillStyle('white')//填充背景色--白色
      ctx.fillRect((canvasWidth - midWidth) / 2, (canvasHeight - midHeight) / 2, midWidth, midHeight)

      var titleArr = [];
      for (var n = 0; n < title.length; n++) {
         titleArr.push(title[n]);
      }
      //console.log(titleArr);

      var titleHeight = midHeight - 10 - midWidth;
      var titleDaxiao = parseInt(titleHeight / title.length);
      //console.log(titleHeight, titleDaxiao);

      titleDaxiao = titleDaxiao > 50 ? 50 : titleDaxiao;

      for (var m = 0; m < titleArr.length; m++) {
         ctx.fillStyle = '#000000';//字体颜色
         ctx.font = 'normal small-caps normal ' + titleDaxiao + 'px Arial';
         ctx.setTextAlign('center')
         ctx.fillText(titleArr[m], canvasWidth / 2, (canvasHeight - midHeight) / 2 + 5 + titleDaxiao * (m + 1))
      }

      ctx.drawImage(imgUrl, (canvasWidth - midWidth) / 2 + 5, canvasHeight - (midWidth + (canvasHeight - midHeight) / 2), midWidth - 10, midWidth - 10)//二维码

      wx.drawCanvas({
         canvasId: canvasName,
         actions: ctx.getActions()
      })
   },

   //数组随机取出一个数
   arrayRandomTakeOne: function (array) {
      var index = Math.floor((Math.random() * array.length + 1) - 1);
      return array[index];
   },



}
Page(page);