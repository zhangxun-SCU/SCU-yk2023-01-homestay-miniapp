// pages/orderConfirm/orderConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem: [
      { id: '1', title: 'Apple/苹果iPhone 11 ProMAX官网旗舰店256G全网通国行正品iPhone11手机', img: '../../assets/imgs/listImg2.png', num: '3', price: '34.99', attr: '属性1;属性2' },
      { id: '2', title: 'Apple/苹果iPhone 11 ProMAX官网旗舰店256G全网通国行正品iPhone11手机', img: '../../assets/imgs/listImg2.png', num: '3', price: '34.99', attr: '属性1;属性2' }
    ],
    good_id:'',
    good_num:'',
    addr:{},
    order_list:[],
    order_id:'',
    total_cost:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(options);
    this.setData({
      good_id:options.good_id,
      good_num:options.num
    })
    var good_list={"good_id":this.data.good_id,"num":this.data.good_num};
    good_list=JSON.stringify(good_list); 
    wx.request({
      url: 'http://localhost:8088/specialtyMarketOrder',
      data:{"good_list":"["+good_list+"]","action":"query_by_list","good_type":"specialty"},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
        console.log(res)
        that.setData({
          order_list:res.data.good_list,
          order_id:res.data.good_list[0].order_id,
          total_cost:that.data.good_num*res.data.good_list[0].good_price
        })
      }
    })

 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.addr)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toPay() {
    wx.request({
      url: 'http://localhost:8088/specialtyMarketOrder',
      data:{"good_list":JSON.stringify(this.data.order_list),"action":"pay_order","good_type":"specialty"},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
        if(res.data.code==0)
        {
          wx.showToast({
            title: '支付成功!',
            icon:'none',
            duration:2000,
            success:function(res){
              setTimeout(function(){
                console.log("success");
        wx.navigateTo({
          url: '../specialty/specialty',
        })
              },2000)
  
            }
          })
        }
        else{
          wx.showToast({
            title: '支付失败!余额不足!',
            icon:'none',
            duration:2000,
            success:function(res){
              setTimeout(function(){
              
         wx.navigateTo({
           url: '../homePage/homePage.wxml',
         });
              },2000)
  
            }
          })
        }
      }
    });
  },
  toAddr() {
    wx.navigateTo({
      url: '../addrMan/addrMan'
    })
  }
})