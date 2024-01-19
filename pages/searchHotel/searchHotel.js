// pages/searchHotel/searchHotel.js
var mHotelList = [];
function HotelBean() {
     var image;
     var name;
     var score;
     var service;
     var address;
     var distance;
     var price;
     var test;
}

Page({
     /**
      * 页面的初始数据
      */
     data: {
          location: '',
          hotelArray: [],
          loadenable: true,
          shownavindex: 1,
          priceL2H: true
     },

     onLoad: function (options) {
       this.getHouseList();
     },
     getHouseList:function(){
       let that =this;

       wx.request({
         url: 'http://localhost:8088/houseMarket',
         data:{"good_type":"house","action":"query_all"},
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
      
      console.log(JSON.stringify(res.data.good_list));
   this.setData({
        hotelArray: res.data.good_list
   });
    },

})