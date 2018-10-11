// pages/set/set.js
var util = require('../../utils/util.js')
var app = getApp()

Page({

   data: {
      custom_sound_default: true,
      custom_fast_select_default: false,
      custom_no_repetition_select_default: false,
      gdhw: [ //更多好玩的参数设置死的
         { 
            
         }
      ]
   },

   onLoad: function (options) {
      // var pages = getCurrentPages();
      // var Page = pages[pages.length - 1];//当前页
      // console.log(Page);
      // var prevPage = pages[pages.length - 2];  //上一个页面
      // var info = prevPage.data //取上页data里的数据也可以修改
      // prevPage.setData({ 键: 值 })//设置数据
   },

   //声音
   switchChangeSound() {
      var that = this, custom_sound_default = that.data.custom_sound_default;
      app.globalData.musicflg = !app.globalData.musicflg ? true : false;
      that.setData({
         custom_sound_default: !custom_sound_default
      })
   },

   //快速决定
   switchChangeFastSelect() {
      var that = this, custom_fast_select_default = that.data.custom_fast_select_default;
      app.globalData.juedin = app.globalData.juedin ? false : true;
      that.setData({
         custom_fast_select_default: !custom_fast_select_default
      })
   },

   //不重复抽取
   switchChangeNoRepetitionSelect() {
      var that = this, custom_no_repetition_select_default = that.data.custom_no_repetition_select_default;
      app.globalData.repeat = !app.globalData.repeat ? true : false;
      that.setData({
         custom_no_repetition_select_default: !custom_no_repetition_select_default
      })
   },

   onShareAppMessage: function () {

   }
})