// pages/goodsDetail/goodsDetail.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../assets/imgs/swiperImg.png',
      '../../assets/imgs/swiperImg.png',
      '../../assets/imgs/swiperImg.png'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    tabs: ["图文详情", "商品参数", "评论（2）"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    flag: true,
    flagPoster:true,
    indicatoractivecolor: '#F44225',
    collection:false,
    classIndexColor:0,
    classIndexSpecs: 0,
    good_price:'',
    good_num:0,
    good_name:'',
    good_id:'',
    main_image:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      good_id:options.good_id,
    })
    this.getRoomList();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.showShareMenu({

      withShareTicket: true
    }); 
  },
  getRoomList:function(){
    let that =this;
    wx.request({
      url: 'http://localhost:8088/getSpecialtyDetail',
      data:{"good_id": this.data.good_id,"good_type":"specialty"},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
       that.handleGetHouseRecordResult(res);
     },
     fail:function(res){
     }
    })
  },
  handleGetHouseRecordResult:function(res){
    console.log(res);
this.setData({
  good_price:res.data.good_price,
  good_name:res.data.good_name,
  good_num:res.data.num,
  main_image:res.data.main_image

});
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  },

  /* 点击减号 */
  bindMinus: function (e) {
    console.log(e);
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    console.log(e);
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },
  //隐藏弹框
  hidePopup: function () {
    this.setData({
      flag: !this.data.flag
    })
  },
  //展示弹框
  showPopup() {
    this.setData({
      flag: !this.data.flag
    })
  }
  ,
  showPoster(){
    this.setData({
      flagPoster:false
    })
  },
  hidePoster() {
    this.setData({
      flagPoster:true
    })
  },
  /**
 *  图片预览方法
 *  此处注意的一点就是，调用 "wx.previewImage"时，第二个参数要求为数组形式哦
 *  当然，做过图片上传功能的应该会注意到，如果涉及到多张图片预览，图片链接数组集合即为参数 urls！
 */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(current);
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  toOrderConfirm(){
    if(this.data.num<0)
    {
      wx.showToast({
        title: '请输入正确的购买数量!',
        icon:'none',
        duration:2000,
      })
    }
    else if(Number(this.data.num)>Number(this.data.good_num))
    {
      wx.showToast({
        title: '没有那么多库存啦!',
        icon:'none',
        duration:2000,
      })
    }
    else
    {
          
      wx.navigateTo({
      url: '../specialtyOrderConfirm/specialtyOrderConfirm?good_id='+this.data.good_id+'&num='+this.data.num,
    })
    }

  },
})