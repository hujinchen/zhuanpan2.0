// components/Dialog/dialog.js
Component({
   options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
   },
   /**
    * 组件的属性列表
    * 用于组件自定义设置
    * 组件的对外属性
    */
   properties: {
      myProperty: { // 属性名
         type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
         value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
         observer: function (newVal, oldVal, changedPath) {
            // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
            // 通常 newVal 就是新设置的数据， oldVal 是旧数据
         }
      },
      // 弹窗标题
      title: {            
         type: String,    
         value: '标题'  
      },
      // 弹窗内容
      content: {
         type: String,
         value: '弹窗内容'
      },
      // 弹窗取消按钮文字
      cancelText: {
         type: String,
         value: '取消'
      },
      // 弹窗确认按钮文字
      confirmText: {
         type: String,
         value: '确定'
      }
   },

   /**
    * 私有数据,组件的初始数据
    * 可用于模版渲染
    * 组件的内部数据
    */
   data: {
      // 弹窗显示控制
      isShow: false,
   },

   // 组件生命周期函数，在组件实例进入页面节点树时执行
   attached:function(){},
   /**
    * 组件的方法列表
    * 更新属性和数据的方法与更新页面数据的方法类似
    */
   methods: {
      /*
       * 公有方法
       */

      //隐藏弹框
      hideDialog() {
         this.setData({
            isShow: !this.data.isShow
         })
      },
      //展示弹框
      showDialog() {
         this.setData({
            isShow: !this.data.isShow
         })
      },

      /*
      * 内部私有方法建议以下划线开头
      * triggerEvent 用于触发事件,过triggerEvent来给父组件传递信息的
      * 写法： this.triggerEvent('cancelEvent', {num: 1})  // 可以将num通过参数的形式传递给父组件
      */
      _cancelEvent() {
         //触发取消回调通
         this.triggerEvent("cancelEvent"); 
      },
      _confirmEvent() {
         //触发成功回调
         this.triggerEvent("confirmEvent");
      }
   }
})