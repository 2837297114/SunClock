import F2 from '../../f2-canvas/lib/f2';

let chart = null;
let broken = [];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //今日专注次数
    todayNumber : 0,
    //累计专注次数
    accumulative : 0,
    //今日专注分钟数
    todayMinuteNumber : 0,
    //累计专注分钟
    accumulativeNumber : 0,
    //3个记录数据
    items : [],
    //是否有数据
    dataBool : false,
    opts: {
      onInit: initChart
    }
  },

  // 单击查看全部
  all : function(){
    wx.navigateTo({
      url: "/pages/record/record"
    })
  },

  //后台进入前台
  onShow : function(){
    //加载页面数据
    this.initDate();
  },

  //加载页面数据
  initDate : function() {
    //今日专注次数
    let todayNumber = 0;
    //累计专注次数
    let accumulative = 0;
    //今日专注分钟数
    let todayMinuteNumber = 0;
    //累计专注分钟
    let accumulativeNumber = 0;
    //今天日期
    let day = this.newtime("YYYY-mm-dd",new Date());
    // 展示最多3个历史
    let item = [];
    // 折线图数据
    let brokenItem = [];

    let _this = this;
    let logs = wx.getStorageSync('logs') || [];

    if(logs.length > 0){
      brokenItem.unshift({
        day: this.getDay(-6, '-').toString().substring(5),
        value: 0,
      },{
        day: this.getDay(-5, '-').toString().substring(5),
        value: 0,
      },{
        day: this.getDay(-4, '-').toString().substring(5),
        value: 0,
      },{
        day: this.getDay(-3, '-').toString().substring(5),
        value: 0,
      },{
        day: this.getDay(-2, '-').toString().substring(5),
        value: 0,
      },{
        day: this.getDay(-1, '-').toString().substring(5),
        value: 0,
      },{
        day: this.newtime("YYYY-mm-dd",new Date()).toString().substring(5),
        value: 0,
      });
      accumulative = logs.length; //累计专注次数 就是数字长度 直接赋值
      for(let i = 0;i < logs.length; i++){
        if(item.length <= 2){
          item.unshift(logs[i]);
        }

        if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == day){
          //今天的
          todayNumber += 1; //今日专注次数
          todayMinuteNumber += logs[i].accomplishMinute;  //今日专注分钟
          brokenItem[6].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-1, '-')){
          brokenItem[5].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-2, '-')){
          brokenItem[4].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-3, '-')){
          brokenItem[3].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-4, '-')){
          brokenItem[2].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-5, '-')){
          brokenItem[1].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }else if(_this.newtime("YYYY-mm-dd",new Date(Date.parse(logs[i].accomplishTime.replace(/-/g,"/")))) == this.getDay(-6, '-')){
          brokenItem[0].value += logs[i].accomplishMinute; //专注总分钟 折线图
        }
        accumulativeNumber += logs[i].accomplishMinute;
      }
      _this.setData({
        accumulative : accumulative,
        todayNumber : todayNumber,
        todayMinuteNumber : todayMinuteNumber,
        accumulativeNumber : accumulativeNumber,
        items : item,
        dataBool : true,
        brokenItem : brokenItem,
      })
      
      broken = [];
      broken = this.data.brokenItem;
      if(chart != null){
        chart.changeData(broken);
      }
    }
  },
  //获取当前时间
  newtime : function(fmt, date){
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
  },
  //获取N天之前的时间或N天之后的时间
  getDay : function(num, str) {
    let today = new Date();
    let nowTime = today.getTime();
    let ms = 24*3600*1000*num;
    today.setTime(parseInt(nowTime + ms));
    let oYear = today.getFullYear();
    let oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    let oDay = today.getDate().toString();
    if (oDay.length <= 1) oDay = '0' + oDay;
    return oYear + str + oMoth + str + oDay;
  }
})

function initChart(canvas, width, height) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
  });
  if(broken.length > 0){
    chart.source(broken);
  }
  chart.tooltip({
    showCrosshairs: true,
    showItemMarker: false,
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].name = null;
      items[0].value = items[0].value + '分钟';
    }
  });

  chart.axis('day', {
    label: function label(text, index, total) {
      var textCfg = {};
      if (index === 0) {
        textCfg.fontStyle = 'left';
      } else if (index === total - 1) {
        textCfg.fontStyle = 'right';
      }
      return textCfg;
    }
  });
  chart.line().position('day*value').color('#ea5340');;
  chart.point().position('day*value').style({
    stroke: '#fff',
    lineWidth: 1,
  }).color('#ea5340');;
  chart.render();
  return chart;
}