// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items : [],
  },

  onShow : function(){
    let _this = this;
    let logs = wx.getStorageSync('logs') || [];
    if(logs.length > 0){
      _this.setData({
        items : logs
      })
    }
  }
})