function RoomBean() {
     var image;
     var name;
     var service;
     var price;
}
Page({
     data: {
          dayCount: 1,
          good_id:'',
          good_name: '',
          location: '',
          price:'',
     },
     onLoad: function (options) {
          var good_id=options.good_id;
          if (good_id !== undefined) {
               this.setData({
                 good_id:good_id
               });
          }
          this.getRoomList();
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
    price:res.data.good_price,
    good_name:res.data.good_name,
    location:res.data.location,
  });
   },
   submitOrder:function(){
    var good_list={"good_id":this.data.good_id,"num":1}; 
    good_list=JSON.stringify(good_list);
    var order_list;
    wx.request({
      url: 'http://localhost:8088/specialtyMarketOrder',
      data:{"good_list":"["+good_list+"]","action":"query_by_list","good_type":"specialty"},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
        order_list=res.data.good_list;
        wx.request({
          url: 'http://localhost:8088/specialtyMarketOrder',
          data:{"good_list":JSON.stringify(order_list),"action":"pay_order","good_type":"specialty"},
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
              url: '../specialty/specialty?house_id=0',
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