// pages/bookHotel/bookHotel.js

var roomPrice;
var hotelName;
var roomName;
var startDate;
var endDate;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          isDiscount: false,
          roomPrice,
          hotelName,
          roomName,
          startDate,
          endDate,
          house_id:"",
          room_id:"",
          num:1,
          discount: '不选择优惠',
          dayCount:1
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          console.log(options);
          roomPrice = options.price;
          hotelName = options.hotelName;
          roomName = options.roomName;
          startDate = options.startDate;
          endDate = options.endDate;

  

          this.setData({
               roomPrice: roomPrice,
               hotelName: hotelName,
               roomName: roomName,
               startDate: startDate,
               endDate: endDate,
               house_id:options.house_id,
               room_id:options.room_id,
               dayCount:options.dayCount
          });
     },
     submitOrder:function(){
      var good_list={"house_id":this.data.house_id,"room_id":this.data.room_id,"need_num":this.data.num,"in_date":this.data.startDate,"out_date":this.data.endDate}; 
      good_list=JSON.stringify(good_list);
      var order_list;
      wx.request({
        url: 'http://localhost:8088/specialtyMarketOrder',
        data:{"good_list":"["+good_list+"]","action":"query_by_list","good_type":"house"},
        method:"POST",
        header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
        success:function(res){
          order_list=res.data.good_list;
          wx.request({
            url: 'http://localhost:8088/specialtyMarketOrder',
            data:{"good_list":JSON.stringify(order_list),"action":"pay_order","good_type":"house"},
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
                url: '../searchHotel/searchHotel?house_id=0',
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
       fail:function(res){

       }
      })
     }

})