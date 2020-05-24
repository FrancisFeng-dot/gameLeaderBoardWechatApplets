// pages/extractq/extractq.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    totalQ: 0,
    hastoken: 0,//是否授权
    userid: ''//加密过的用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmrank.boc7.net/v1_getSelfMoney',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code==0) {
            that.setData({
              totalQ: value.data.money,
              userid: value.data.uid,
              hastoken: 1
            });
          } else {
            try {
              wx.clearStorageSync();
              wx.redirectTo({
                url: '/pages/login/login'
              })
            } catch (e) {
              console.log('Do something when catch error');
            }
          }
        },
        fail: function (res) {
          console.log('获取金额情况失败');
        }
      });
    }
  },

  /**
   * 提取奖励
   */
  requestqcoin: function (e) {
    var that = this;
    if (e.detail.value.money) {
      if (that.data.totalQ < e.detail.value.money) {
        wx.showToast({
          title: '现金余额不足',
          icon: 'none',
          duration: 2000
        })
      } else {
        var token = wx.getStorageSync('token');
        if (token) {
          var data = { token: token, money: e.detail.value.money, 'type': 1, formid: e.detail.formId };//token字符串转成对象
          data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
          wx.request({
            url: 'https://qmrank.boc7.net/v1_distillMoney',
            method: 'post',
            data: { data: data },//字符串转成json对象
            success: function (res) {
              var value = app.decrypt(res.data);
              console.log(value);
              if (value.code == 0) {
                that.setData({
                  totalQ: parseFloat(that.data.totalQ - e.detail.value.money).toFixed(2)
                });
              }
              if (value.code == 433) {
                that.setData({
                  masklayer: !that.data.masklayer
                })
              }
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              })
            },
            fail: function (res) {
              console.log('提取现金失败');
            }
          });
        }
      }
    }else{
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户关闭弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
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
    this.setData({
      masklayer: true,//遮罩层默认关闭
      totalQ: 0,
      hastoken: 0,//是否授权
      userid: ''//加密过的用户id
    })
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
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
    var that = this;
    if (that.data.userid) {//已经加密,不符合上述两种情况，分享
      return {
        title: '每天免费抽现金红包，各种大奖等你来拿!',
        path: 'pages/lottery/lottery?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_lottery1.jpg'
      }
    } else {//未登录状态分享
      return {
        title: '每天免费抽现金红包，各种大奖等你来拿!',
        path: 'pages/lottery/lottery',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_lottery1.jpg'
      }
    }
  }
})