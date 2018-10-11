const ctx = wx.createCanvasContext("canvasI"); //创建id为canvasI的绘图
const ctx2 = wx.createCanvasContext("bgCanvas");//创建id为bgCanvas的背景绘图
var mytime;//跑马灯定时器名称
var lamp = 0; //判断跑马灯闪烁标记
Page({

   /**
    * 页面的初始数据
    */
   data: {
      itemsNum: 6, //大转盘等分数
      itemsArc: 0, //大转盘每等分角度
      color: ["#FFB932", "#ffd57c"],//扇形的背景颜色交替；
      text: ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"],//每个扇形中的文字填充
      isRotate: 60,
   },
   start() { //点击抽奖按钮, 为了达到慢速开始慢速结束的效果，在这里使用css3的过渡效果
      console.log("start");
      // 五等奖:0
      // 六等奖:300
      // 一等奖:240
      // 二等奖:180
      // 三等奖:120
      // 四等奖:60
      let that = this;

      // 指定获奖结果
      let n = that.data.isRotate; //传入指定的旋转角度，内部指定获奖结果。在指定角度上加上旋转基数模拟转盘随机旋转。

      //随机获奖结果
      let rand = Math.random() * 1000;//取一个随机的旋转角度，使获奖结果随机化。
      n = n + rand - (rand % 60) + 1440; //1440为旋转基数，最低要旋转1440度，即4圈。rand-(rand%60) 这个是让指针永远停在扇形中心的算法。n + 是为了重复点击的时候有足够的旋转角度。
      console.log(n % 360);
      that.setData({
         isRotate: n,
      })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (e) {
      let that = this;
      let itemsArc = 360 / that.data.itemsNum;//获取大转盘每等分的角度。
      that.setData({
         itemsArc
      }, function () {
         that.Items(itemsArc);//每一份扇形的内部绘制。
         // that.light();
         mytime = setInterval(that.light, 1000);//启动跑马灯定时器。
      })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      var that = this;
      that.light();
   },
   light() { //跑马灯的绘制
      let that = this;
      let itemsNum = that.data.itemsNum;
      lamp++;
      if (lamp >= 2) {
         lamp = 0
      }
      ctx2.beginPath();
      ctx2.arc(150, 150, 150, 0, 2 * Math.PI);//绘制底色为红色的圆形
      ctx2.setFillStyle("#DF1E14");
      ctx2.fill();
      ctx2.beginPath();
      ctx2.arc(150, 150, 135, 0, 2 * Math.PI);//绘制底色为深黄的圆形
      ctx2.setFillStyle("#F5AD26");
      ctx2.fill();
      for (let i = 0; i < itemsNum * 2; i++) {//跑马灯小圆圈比大圆盘等分数量多一倍。
         ctx2.save();
         ctx2.beginPath();
         ctx2.translate(150, 150);
         ctx2.rotate(30 * i * Math.PI / 180);
         ctx2.arc(0, -135, 8, 0, 2 * Math.PI);//绘制坐标为(0,-135)的圆形跑马灯小圆圈。

         //跑马灯第一次闪烁时与第二次闪烁时绘制相反的颜色，再配上定时器循环闪烁就可以达到跑马灯一闪一闪的效果了。

         if (lamp == 0) { //第一次闪烁时偶数奇数的跑马灯各绘制一种颜色
            if (i % 2 == 0) {
               ctx2.setFillStyle("#FBF1A9");
            } else {
               ctx2.setFillStyle("#fbb936");
            }
         } else { //第二次闪烁时偶数奇数的跑马灯颜色对调。
            if (i % 2 == 0) {
               ctx2.setFillStyle("#fbb936");
            } else {
               ctx2.setFillStyle("#FBF1A9");
            }
         }
         ctx2.fill();
         ctx2.restore();//恢复之前保存的上下文，可以将循环出来的跑马灯都保存下来。没有这一句那么每循环出一个跑马灯则上一个跑马灯绘图将被覆盖，
      }
      ctx2.draw();

   },
   Items(e) {
      console.log(e);
      let that = this;
      let itemsArc = e;//每一份扇形的角度
      let Num = that.data.itemsNum;//等分数量
      let text = that.data.text;//放文字的数组
      for (let i = 0; i < Num; i++) {
         ctx.beginPath();
         ctx.moveTo(125, 125);
         ctx.arc(125, 125, 120, itemsArc * i * Math.PI / 180, (itemsArc + itemsArc * i) * Math.PI / 180);//绘制扇形，注意下一个扇形比上一个扇形多一个itemsArc的角度。
         ctx.closePath();
         if (i % 2 == 0) {//绘制偶数扇形和奇数扇形的颜色不同
            ctx.setFillStyle(that.data.color[0]);
         } else {
            ctx.setFillStyle(that.data.color[1]);
         }
         ctx.fill();
         ctx.save();
         ctx.beginPath();
         ctx.setFontSize(12);//设置文字字号大小
         ctx.setFillStyle("#000");//设置文字颜色
         ctx.setTextAlign("center");//使文字垂直居中显示
         ctx.setTextBaseline("middle");//使文字水平居中显示
         ctx.translate(125, 125);//将原点移至圆形圆心位置
         ctx.rotate((itemsArc * (i + 2)) * Math.PI / 180);//旋转文字，从 i+2 开始，因为扇形是从数学意义上的第四象限第一个开始的，文字目前的位置是在圆心正上方，所以起始位置要将其旋转2个扇形的角度让其与第一个扇形的位置一致。
         ctx.fillText(text[i], 0, -90);
         ctx.restore();//保存绘图上下文，使上一个绘制的扇形保存住。
      }
      that.Images();
      ctx.draw(true);//参数为true的时候，保存当前画布的内容，继续绘制
   },
   
   Images() {//绘制奖品图片，与绘制文字方法一致。
      let that = this;
      let itemsArc = that.data.itemsArc;
      let Num = that.data.itemsNum;
      for (let i = 0; i < Num; i++) {
         ctx.save();
         ctx.beginPath();
         ctx.translate(125, 125);
         ctx.rotate(itemsArc * (i + 2) * Math.PI / 180);
         // ctx.drawImage("/images/quan.jpg", -23, -75, 46, 25);
         ctx.restore();
      }
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {

   }
})
