// pages/more/more.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    box: [],
    activebanner: [],
    gold:0,
    money:0,
    headimg: '',
    nickname: '',
    hastoken:0,
    masklayer: true,//遮罩层默认关闭
    contactparams: '',//访问客服界面的参数
    userid: ''//加密后
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(!token){
      token = '';
    }
    var data = {token:token};//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmrank.boc7.net/v1_index',
      method: 'post',
      data: {data:data},//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            box: value.data.game,
            activebanner: value.data.banner,
            userid: token?value.data.uid:0,
            gold: token?value.data.gold:0,
            money: token?value.data.money:0.00,
            hastoken: token?1:0
          });
          if (token) {
            wx.getUserInfo({
              success: res => {
                that.setData({
                  headimg: res.userInfo.avatarUrl,
                  nickname: res.userInfo.nickName
                })
              }
            });
          }
        } else {
          try {
            wx.clearStorageSync();
            wx.redirectTo({
              url: '/pages/login/login'
            });
          } catch (e) {
            console.log('Do something when catch error');
          }
        }
      },
      fail: function (res) {
        console.log('获取游戏失败');
      }
    });
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
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    console.log(e);
    if (e.currentTarget.dataset) {
      this.setData({
        masklayer: !this.data.masklayer,
        contactparams: e.currentTarget.dataset.params
      })
    }
  },

  /**
   * 点击跳转链接
   */
  jumpapplet: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var opentype = e.currentTarget.dataset.type;
    if (e.currentTarget.dataset.gametype) {
      var gametype = e.currentTarget.dataset.gametype;
    }
    if (opentype == 'box'){
      if (that.data.box[gametype][index].type == 2) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [that.data.box[gametype][index].poster_img] // 需要预览的图片http链接列表
        })
      }
    }
    if (opentype == 'banner') {
      if (that.data.activebanner[index].type == 2) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [that.data.activebanner[index].poster_img] // 需要预览的图片http链接列表
        })
      }
    }
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
      box: [],
      activebanner: [],
      gold: 0,
      money: 0,
      headimg: '',
      nickname: '',
      masklayer: true,//遮罩层默认关闭
      contactparams: '',//访问客服界面的参数
      userid: ''//加密后
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
        title: '好玩又抓狂，每周都有新游戏，你的好友都在这里玩耍~',
        path: 'pages/index/index?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_gamelist1.jpg'
      }
    } else {//未登录状态分享
      return {
        title: '好玩又抓狂，每周都有新游戏，你的好友都在这里玩耍~',
        path: 'pages/index/index',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_gamelist1.jpg'
      }
    }
  }
})