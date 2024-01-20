// pages/hotelDetail/hotelDetail.js

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth() + 1;
var currentDay = new Date().getDate();
var currentWeek = new Date().getDay();
var mon='';
var da='';
if(currentMonth<10)
{
  var mon='0';
}
if(currentDay<10)
{
  var da='0';
}
var currentDate = currentYear + '-'+mon + currentMonth + '-' + da+currentDay;

var startDate = '';
var startYear;
var startDay;
var startMonth;
var startWeek;
var startDayCount;

var endDate = '';
var endYear;
var endDay;
var endMonth;
var endWeek;

var startTommorrow; 


var dayCount = 1;

function RoomBean() {
     var image;
     var name;
     var service;
     var price;
}


Page({

     /**
      * 页面的初始数据
      */
     data: {
          startDate: '',
          currentDate: '',
          endOfStartDate: '',
          endDate: '',
          endOfEndDate: '',
          startDay: '',
          startMonth: '',
          startWeek: '',
          endDay: '',
          endMonth: '',
          endWeek: '',
          dayCount: 1,
          good_id:'',
          good_name: '',
          location: '',
          roomArray: [
               {
                    image: '../../res/images/jiudian.jpg',
                    name: '标准单人间',
                    service: 'WiFi/有窗/空调',
                    price: 138
               }, {
                    image: '../../res/images/jiudian.jpg',
                    name: '标准双人间',
                    service: 'WiFi/有窗/空调',
                    price: 328
               }, {
                    image: '../../res/images/jiudian.jpg',
                    name: '豪华单人间',
                    service: 'WiFi/有窗/空调',
                    price: 298
               }, {
                    image: '../../res/images/jiudian.jpg',
                    name: '豪华双人间',
                    service: 'WiFi/有窗/空调',
                    price: 258
               }
          ],
          serviceList: [
               {
                    icon: '../../res/images/ic_service_park.png',
                    name: '停车场'
               },
               {
                    icon: '../../res/images/ic_service_food.png',
                    name: '营养早餐'
               },
               {
                    icon: '../../res/images/ic_service_park.png',
                    name: '健身室'
               },
               {
                    icon: '../../res/images/ic_service_food.png',
                    name: '免费WiFi'
               },
               {
                    icon: '../../res/images/ic_service_park.png',
                    name: '叫车服务'
               },
               {
                    icon: '../../res/images/ic_service_food.png',
                    name: '营养早餐'
               },
               {
                    icon: '../../res/images/ic_service_park.png',
                    name: '健身室'
               },
               {
                    icon: '../../res/images/ic_service_food.png',
                    name: '免费WiFi'
               },
               {
                    icon: '../../res/images/ic_service_park.png',
                    name: '叫车服务'
               }
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          startDate = currentDate;
          startYear = currentYear;
          startDay = currentDay;
          startMonth = currentMonth;
          startWeek = currentWeek;

          this.initEndDate();
          this.setSearchDate();

          console.log(options);
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
        url: 'http://localhost:8088/getHouseDetail',
        data:{"good_id": this.data.good_id,"good_type":"house","in_date":this.data.startDate,"out_date":this.data.endDate},
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
     
     console.log(JSON.stringify(res.data.good_list));
  this.setData({
    good_name:res.data.good_name,
    location:res.data.location,
    roomArray:res.data.room_list
  });
   },
     bookRoom: function (e) {
          var index = e.currentTarget.dataset.index;
          var room = this.data.roomArray[index];
          if(room.res_num<1)
          {

          }
          else{
          wx.navigateTo({
               url: '../bookHotel/bookHotel?price=' + room.room_price + '&house_id='+this.data.good_id+'&hotelName=' + this.data.good_name + '&roomName=' + room.room_name +'&room_id='+room.room_id+ '&startDate=' + startDate + '&endDate=' + endDate+'&dayCount='+this.data.dayCount,
          })
          }

     },

     startDateChange: function (e) {
          console.log(e);
          startDate = e.detail.value;
          var startArray = startDate.split('-');
          startYear = parseInt(startArray[0]);
          startDay = parseInt(startArray[2]);
          startMonth = parseInt(startArray[1]);
          startWeek = new Date(startYear, startMonth, startDay).getDay();

          var startFormat = this.formatDate(startDate);
          var endFormat = this.formatDate(endDate);
          if (new Date(endFormat) < new Date(startFormat)) {
               this.initEndDate();
          }

          this.setSearchDate();
          let that=this;
          wx.request({
            url: 'http://localhost:8088/getHouseDetail',
            data:{"good_id": this.data.good_id,"good_type":"house","in_date":this.data.startDate,"out_date":this.data.endDate},
            method:"POST",
            header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
            success:function(res){
             that.handleGetHouseRecordResult(res);
           },
           fail:function(res){
    
           }
          })
     },

     endDateChange: function (e) {
          console.log(e);
          endDate = e.detail.value;
          var endArray = endDate.split('-');
          endYear = parseInt(endArray[0]);
          endDay = parseInt(endArray[2]);
          endMonth = parseInt(endArray[1]);
          endWeek = new Date(endYear, endMonth, endDay).getDay();

          this.setSearchDate();
          let that=this;
          wx.request({
            url: 'http://localhost:8088/getHouseDetail',
            data:{"good_id": this.data.good_id,"good_type":"house","in_date":this.data.startDate,"out_date":this.data.endDate},
            method:"POST",
            header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
            success:function(res){
             that.handleGetHouseRecordResult(res);
           },
           fail:function(res){
    
           }
          })
     },

     formatDate: function (date) {
          return date.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/');
     },

     getWeekday: function (week) {
          var weekday = new Array(7)
          weekday[0] = "周日"
          weekday[1] = "周一"
          weekday[2] = "周二"
          weekday[3] = "周三"
          weekday[4] = "周四"
          weekday[5] = "周五"
          weekday[6] = "周六"

          return weekday[week];
     },

     prefixInteger: function (num, length) {
          return (Array(length).join('0') + num).slice(-length);
     },

     getDayCount: function (startDate, endDate) {
          var startFormat = this.formatDate(startDate);
          var endFormat = this.formatDate(endDate);

          var start = new Date(startFormat);
          var end = new Date(endFormat);

          var result = end - start;
          if (result >= 0) {
               var days = parseInt(result / (1000 * 60 * 60 * 24));
               return days == 0 ? 1 : days;
          } else {
               return 0;
          }
     },

     initEndDate: function () {
          startDayCount = new Date(startYear, startMonth, 0).getDate();
          if (startMonth == 12 && startDay == 31) {
               endYear = startYear + 1;
               endMonth = 1;
               endDay = 1;
          } else {
               endYear = startYear;
               if (startDay <= startDayCount) {
                    endMonth = startMonth
                    endDay = startDay + 1;
               } else {
                    endMonth = startMonth + 1;
                    endDay = 1;
               }
          }
          if (currentWeek >= 7) {
               endWeek = 1;
          } else {
               endWeek = currentWeek + 1;
          }
          endDate = endYear + '-' + endMonth + '-' + endDay;
     },

     setSearchDate: function () {
          this.setData({
               currentDate: currentDate,
               startDate: startDate,
               startDay: this.prefixInteger(startDay, 2),
               startMonth: this.prefixInteger(startMonth, 2),
               startWeek: this.getWeekday(startWeek),
               endDate: endDate,
               endDay: this.prefixInteger(endDay, 2),
               endMonth: this.prefixInteger(endMonth, 2),
               endWeek: this.getWeekday(endWeek),
               dayCount: this.getDayCount(startDate, endDate)
          });
     },
})