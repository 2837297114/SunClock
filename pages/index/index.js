const back = wx.getBackgroundAudioManager();

Page({
  data: {
    //用户选择的分钟数
    timingMinute : 1,
    //用户选择的毫秒数 由分钟转换而来 作用于画圆
    mTime : 60000,
    //倒计时显示的时间
    strTime : '01:00',
    //可选择的分钟数
    timingMinutes : [1,3,6,12,18,24,30,40,50,60],
    //背景音乐地址
    musicSrc : "https://app-1252652844.cos.ap-nanjing.myqcloud.com/5c925b81a5d9.mp3",
    //类型选项配置
    typeItems : [
      {
        index : 0,
        name : "工作",
        image : "/images/work.jpg",
        borderBottom : "#33a6ff",
      },
      {
        index : 1,
        name : "学习",
        image : "/images/study.jpg",
        borderBottom : "#7ed320",
      },
      {
        index : 2,
        name : "思考",
        image : "/images/reflect.jpg",
        borderBottom : "#ffa21f",
      },
      {
        index : 3,
        name : "写作",
        image : "/images/writing.jpg",
        borderBottom : "#34d4ea",
      },
      {
        index : 4,
        name : "运动",
        image : "/images/exercise.jpg",
        borderBottom : "#6d65ca",
      },
      {
        index : 5,
        name : "阅读",
        image : "/images/read.jpg",
        borderBottom : "#ff4258",
      }
    ],
    //当前选择类型下标
    selectItemIndex : 0,
    // 用户界面状态 true ：计时页 false ：选择类型页
    timeCode : false,
    //计时页 页面高度 rpx
    clockHeigth : 0,
    rate : 0,
    // 音乐 true:静音 false:不静音
    sound : false,
    // 静音|不静音图标
    soundImage : [
      "/images/jy.png",
      "/images/sy.png",
    ],
    //暂停按钮 false隐藏
    pauseBtn : false,
    //继续按钮 false隐藏
    continue : false,
    //放弃按钮 false隐藏
    waive : false,
    //完成按钮 false隐藏
    complete : false,
    //计时器ID 用于清除计时器
    timerId : "",
  },

  // 用户点击开始计时
  startTime : function(){
    this.setData({
      //暂停按钮 true显示
      pauseBtn : true,
      //继续按钮 false隐藏
      continue : false,
      //放弃按钮 false隐藏
      waive : false,
      //完成按钮 false隐藏
      complete : false,
      // 用户界面状态 设置为计时页
      timeCode : true,
      // 音乐 false:不静音
      sound : false,
      // 将分钟转换为毫秒
      mTime : this.data.timingMinute * 60 * 1000,
      // 转为时间 如 01:00 计时页的倒计时
      strTime : this.data.timingMinute >= 10 ? this.data.timingMinute + ":00" : "0" + this.data.timingMinute + ":00"
    })
    //循环播放音乐
    this.backmusic();
    //动态画圆
    this.DrawCircle();
  },

  //单击暂停
  pauseTime : function(){
    this.setData({
      //暂停按钮 false隐藏
      pauseBtn : false,
      //继续按钮 true显示
      continue : true,
      //放弃按钮 true显示
      waive : true,
      //完成按钮 false隐藏
      complete : false,
      // 音乐 true:暂停
      sound : true,
    })
    //清除计时器 暂停
    clearInterval(this.data.timerId);
    back.pause();
  },

  //单击继续
  continueTime : function(){
    this.setData({
      //暂停按钮 true显示
      pauseBtn : true,
      //继续按钮 false隐藏
      continue : false,
      //放弃按钮 false隐藏
      waive : false,
      //完成按钮 false隐藏
      complete : false,
      // 音乐 false:继续播放
      sound : false,
    })
    this.DrawCircle();
    back.play();
  },

  //单击放弃
  waive : function(){
    this.setData({
      //暂停按钮 false隐藏
      pauseBtn : false,
      //继续按钮 false隐藏
      continue : false,
      //放弃按钮 false隐藏
      waive : false,
      //完成按钮 false隐藏
      complete : false,
      // 用户界面状态 false ：选择类型页
      timeCode : false,
      // 音乐 false:不静音
      sound : false,
    })
    //清除计时器 停止
    clearInterval(this.data.timerId);
    //音乐停止
    back.stop();
  },

  //单击完成
  accomplish : function(){
    this.setData({
      // 用户界面状态 false ：选择类型页
      timeCode : false,
    })
  },

  // 用户选择分钟数的事件
  timing : function(e){
    // 选择项的下标
    let index = e.detail.value;
    //根据下标获取选择的时间
    let minute = this.data.timingMinutes[index];
    //更改用户选择的分钟数
    this.setData({
      timingMinute : minute
    })
  },

  //用户单击声音按钮 静音|不静音
  soundTap : function(){
    if(this.data.sound){
      //当前是静音 设置为有声音
      this.setData({
        sound : false
      })
      //音乐播放
      back.play();
    }else{
      //当前不是静音 设置为静音
      this.setData({
        sound : true
      })
      //音乐暂停
      back.pause();
    }
  },

  //循环播放音乐
  backmusic:function(){
    let _this = this;
    player();
    function player(){
      back.title = "太阳闹钟";
      back.src = _this.data.musicSrc;
      back.onEnded(() => {
        player();
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let res = wx.getSystemInfoSync();
    let rate = 750 / res.windowWidth;
    this.setData({
      clockHeigth : rate * res.windowHeight,
      rate : rate
    })
    this.staticDrawCircle();
  },
  
  // 类型选择 单击事件
  typeClick : function(e){
    // 用户点击的选项下标
    let tapIndex = e.currentTarget.dataset["index"];
    // 赋值给当前选择类型下标
    this.setData({
      selectItemIndex : tapIndex,
    })
  },

  //圆 装饰
  staticDrawCircle : function(){
    //rpx转为px单位
    let lineWidth = 2 / this.data.rate;
    let ctx = wx.createCanvasContext('progress_bg1');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle("rgba(255,255,255,0.2)");
    ctx.setLineCap('round');
    ctx.beginPath();
    let x = 600 / this.data.rate / 2;
    let y = 600 / this.data.rate / 2;
    let r = 600 / this.data.rate / 2 - 2 * lineWidth;
    ctx.arc(x,y,r,0,2 * Math.PI,false);
    ctx.stroke();
    ctx.draw();

    let lineWidth1 = 2 / this.data.rate;
    let ctx1 = wx.createCanvasContext('progress_bg2');
    ctx1.setLineWidth(lineWidth1);
    ctx1.setStrokeStyle("rgba(255,255,255,0.2)");
    ctx1.setLineCap('round');
    ctx1.beginPath();
    let x1 = 460 / this.data.rate / 2;
    let y1 = 460 / this.data.rate / 2;
    let r1 = 460 / this.data.rate / 2 - 2 * lineWidth1;
    ctx1.arc(x1,y1,r1,0,2 * Math.PI,false);
    ctx1.stroke();
    ctx1.draw();

    let lineWidth2 = 4 / this.data.rate;
    let ctx2 = wx.createCanvasContext('progress_bg3');
    ctx2.setLineWidth(lineWidth2);
    ctx2.setStrokeStyle("rgba(255,255,255,0.2)");
    ctx2.setLineCap('round');
    ctx2.beginPath();
    let x2 = 360 / this.data.rate / 2;
    let y2 = 360 / this.data.rate / 2;
    let r2 = 360 / this.data.rate / 2 - 2 * lineWidth2;
    ctx2.arc(x2,y2,r2,0,2 * Math.PI,false);
    ctx2.stroke();
    ctx2.draw();
  },

  //动态画圆
  DrawCircle : function(){
    let _this = this;

    let timer = setInterval(function(){
      //圆形每次要走的弧度
      let angle = 1.5 + 2 * (_this.data.timingMinute * 60 * 1000 - _this.data.mTime) / (_this.data.timingMinute * 60 * 1000);
      //每次减100毫秒
      let currentTime = _this.data.mTime - 100;
      //赋值 剩余毫秒数
      _this.setData({
        mTime : currentTime
      })
      if(angle < 3.5){
        //能被1000整除就代表过去了1秒
        if(currentTime % 1000 == 0){
          //秒数
          let second = currentTime / 1000;
          //分钟 可能会有余数 转为整数 余数就是剩余的秒数
          let minute = parseInt(second / 60);
          //剩余的秒数
          let surplusSecond = second - minute * 60;
          //分钟部分字符串
          let strMinute = minute >= 10 ? minute : "0" + minute;
          //秒部分字符串
          let strsecond = surplusSecond >= 10 ? surplusSecond : "0" + surplusSecond;
          //分钟和秒拼接
          let Timestr = strMinute + ":" + strsecond;
          //赋值给倒计时显示的时间
          _this.setData({
            strTime : Timestr
          })
        }
        //rpx转为px单位
        let lineWidth2 = 4 / _this.data.rate;
        //指定画布
        let ctx2 = wx.createCanvasContext('progress_active');
        //设置线条宽度
        ctx2.setLineWidth(lineWidth2);
        //设置线条颜色
        ctx2.setStrokeStyle("rgba(255,255,255,1)");
        //设置线条端点样式
        ctx2.setLineCap('round');
        //开始一条路径或重置当前的路径
        ctx2.beginPath();
        //圆的中心的 x 坐标
        let x2 = 360 / _this.data.rate / 2;
        //圆的中心的 y 坐标。
        let y2 = 360 / _this.data.rate / 2;
        //圆的半径。
        let r2 = 360 / _this.data.rate / 2 - 2 * lineWidth2;
        //创建弧/曲线
        ctx2.arc(x2,y2,r2,1.5 * Math.PI,angle * Math.PI,false);
        //边框
        ctx2.stroke();
        //应用
        ctx2.draw();
      }else{
        //计时完成清除计时器
        clearInterval(timer);

        _this.setData({
          //暂停按钮 false隐藏
          pauseBtn : false,
          //继续按钮 false隐藏
          continue : false,
          //放弃按钮 false隐藏
          waive : false,
          //完成按钮 true显示
          complete : true,
        })
        //停止音乐
        back.stop();

        let logs = wx.getStorageSync('logs') || [];

        logs.unshift({
          name : _this.data.typeItems[_this.data.selectItemIndex].name,
          accomplishTime : _this.newtime("YYYY-mm-dd HH:MM:SS",new Date()),
          accomplishMinute : _this.data.timingMinute,
        })
        wx.setStorageSync('logs', logs);
      }
    },100)
    _this.setData({
      timerId : timer
    })
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
  
  //后台进入前台 继续播放音乐 继续计时
  onShow : function(){
    if(this.data.pauseBtn){
      back.play();
      this.DrawCircle();
    }
  },

  //前台进入后台 暂停音乐 暂停计时 防止用户后台挂机
  onHide : function(){
    if(this.data.pauseBtn){
      back.pause();
      clearInterval(this.data.timerId);
    }
  }
})