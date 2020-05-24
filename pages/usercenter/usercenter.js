// pages/usercenter/usercenter.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    user:{},//用户信息
    gold: 0,//总金币
    money: 0,//总钱
    gamelist: [],//游戏列表
    signin: 0,//是否签到
    has_signnum: 0,//已经签到的天数
    signstar: [],
    hastoken:0,//是否授权
    event: 0,//弹框事件
    contactparams: '',
    invitefriendgold:0,//邀请好友获得的战力
    partlotterygold:0,//参与抽奖获得的战力
    playgamebattle: 0,//试玩游戏获得的战力
    invitefriend: 0,//参与邀请好友任务状态
    invitegold: 0,//领取邀请好友的奖励
    partinlottery: 0,//参与抽奖任务状态
    lotterygold:0,//领取参与抽奖的获取的奖励
    has_signnum:0,//已签到次数
    getgoldnum1:0,//领取玩游戏的奖励
    playgame_getgold1: 0,//完成玩游戏任务状态
    getgoldnum2: 0,//领取玩游戏的奖励
    playgame_getgold2: 0,//完成玩游戏任务状态
    hasplay_gamenum:0,//玩游戏任务的进度
    userid:''//加密后
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      token = '';
    }
    var data = { token: token };//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmrank.boc7.net/v1_selfCenter',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            gamelist: value.data.game,
            invitefriendgold: value.data.invite_gold,//邀请好友获得的战力
            partlotterygold: value.data.lottery_gold,//参与抽奖获得的战力
            playgamebattle: value.data.game_gold,//试玩游戏获得的战力
            signin: token?value.data.is_sign:0,//是否签到
            userid: token ?value.data.uid:0,
            gold: token ?value.data.gold:0,
            money: token ?value.data.money:0.00,
            hastoken: token ?1:0,
            hasplay_gamenum: token ?value.data.play_game.total:0,
            has_signnum: token?(value.data.continue_sign.length > 0 ? value.data.continue_sign.length : 0):0
          })
          var arr = [];
          var num = value.data.sign_gold;
          if (token) {
            wx.getUserInfo({
              success: res => {
                that.setData({
                  user: { headimg: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
                })
              }
            });
            
            for (var i = 0; i < 7; i++) {
              if (value.data.continue_sign[i] > 0) {
                arr.push({ 'hassign': 1, 'num': num });
              } else {
                arr.push({ 'hassign': 0, 'num': num });
              }
              if (i == 5) {
                num += 100;
              } else {
                num += 10;
              }
            }
            that.setData({
              signstar: arr
            });

            if (value.data.invite.total == value.data.invite.num) {
              that.setData({
                invitefriend: 0
              });
            } else if (value.data.invite.total > value.data.invite.num) {
              that.setData({
                invitefriend: 1,
                invitegold: value.data.invite_gold * (value.data.invite.total - value.data.invite.num)
              });
            }//判断邀请好友

            if (value.data.lottery.total == value.data.lottery.num) {
              that.setData({
                partinlottery: value.data.lottery.total == 0?0:2
              });
            } else if (value.data.lottery.total > value.data.lottery.num) {
              that.setData({
                partinlottery: 1,
                lotterygold: value.data.lottery_gold * (value.data.lottery.total - value.data.lottery.num)
              });
            }//判断是否参与抽奖

            if (value.data.play_game.total == value.data.play_game.num) {
              that.setData({
                playgame_getgold1: value.data.play_game.total >= 3?2:0,
                playgame_getgold2: value.data.play_game.total >= 3?(value.data.play_game.total >= 5 ? 2 : 0):0
              });
            } else {
              if (value.data.play_game.num < 5) {
                that.setData({
                  playgame_getgold2: 1,
                  getgoldnum2: value.data.play_game.total > 5 ? value.data.game_gold * (5 - value.data.play_game.num) : value.data.game_gold * (value.data.play_game.total - value.data.play_game.num),
                  playgame_getgold1: value.data.play_game.num < 3 ? 1 : 2,
                  getgoldnum1: value.data.play_game.num < 3 ? (value.data.play_game.total > 3 ? value.data.game_gold * (3 - value.data.play_game.num) : value.data.game_gold * (value.data.play_game.total - value.data.play_game.num)) : 0
                });
              } else {
                that.setData({
                  playgame_getgold1: 2,
                  playgame_getgold2: 2
                });
              }
            }
          } else {
            for (var i = 0; i < 7; i++) {
              arr.push({ 'hassign': 0, 'num': num });
              if (i == 5) {
                num += 100;
              } else {
                num += 10;
              }
            }
            that.setData({
              signstar: arr
            });
          }
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
   * 开启弹框
   */
  openlayer: function (e) {
    if(e.currentTarget.dataset){
      this.setData({
        masklayer: !this.data.masklayer,
        event: e.currentTarget.dataset.layertype
      })
    }
  },

  /**
   * 领取奖励
   */
  taskgold: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token&&e.currentTarget.dataset) {
      var data = { token: token, type_id: e.currentTarget.dataset.clicktype };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmrank.boc7.net/v1_harvestGold',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            if (e.currentTarget.dataset.clicktype ==5){
              that.setData({
                invitefriend: 0,
                gold: that.data.gold + that.data.invitegold
              });
            } else if (e.currentTarget.dataset.clicktype == 6){
              that.setData({
                partinlottery: 2,
                gold: that.data.gold + that.data.lotterygold
              });
            } else if (e.currentTarget.dataset.clicktype == 7){
              // if (e.currentTarget.dataset.gamecoin == 3) {
              that.setData({
                playgame_getgold1: 2,
                playgame_getgold2: 2,
                gold: that.data.gold + that.data.getgoldnum2
              });
            }
          }
          wx.showToast({
            title: value.msg,
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
          console.log('领取奖励失败');
        }
      });
    }
  },

  /**
   * 复制到剪切板
   */
  clipboard: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.gamelist[index].type == 2) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.gamelist[index].poster_img] // 需要预览的图片http链接列表
      })
    }else{
      setTimeout(function(){
        var token = wx.getStorageSync('token');
        if (token) {
          var frontback = app.globaldata.gametime;
          console.log(frontback);
          var interval = 0;//记录玩游戏的时间
          var setinterval = setInterval(function () {
            frontback = app.globaldata.gametime;
            console.log(frontback);
            interval += 1;
            console.log(interval);
            if (interval >= 20) {
              clearInterval(setinterval);
              var data = { token: token, game_id: that.data.gamelist[index].game_id };//token字符串转成对象
              data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
              wx.request({
                url: 'https://qmrank.boc7.net/v1_playGame',
                method: 'post',
                data: { data: data },//字符串转成json对象
                success: function (res) {
                  var value = app.decrypt(res.data);
                  console.log(value);
                  if (value.code == 0) {
                    var arr = that.data.gamelist;
                    for (var i = 0; i < arr.length; i++) {
                      if (i == index) {
                        arr[i].has_play = 1;
                      }
                    };
                    that.setData({
                      gamelist: arr
                    });
                    wx.showToast({
                      title: '试玩成功，请去个人中心领取奖励',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                  if (value.code == 403) {
                    wx.showToast({
                      title: '试玩新游戏才能领取奖励哦~',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                },
                fail: function (res) {
                  console.log('添加积分失败');
                }
              });
            } else {
              if (frontback == 1) {
                console.log(interval);
                clearInterval(setinterval);
                if(that.data.gamelist[index].has_play!=1){
                  wx.showToast({
                    title: '需要停留20秒，才算试玩成功哦~',
                    icon: 'none',
                    duration: 2000
                  });
                }
              }
            }
          }, 1000);
        }
      },5000);
    }
  },

  /**
   * 用户签到
   */
  clicksign: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(e);
    if (token) {
      var data = { token: token, formid: e.detail.formId };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmrank.boc7.net/v1_sign',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            wx.showToast({
              title: '签到成功，战力增加+' + value.data.gold,
              icon: 'none',
              duration: 2000
            });
            var arr = that.data.signstar;
            if (that.data.has_signnum == 7) {
              for (var i = 0; i < 7; i++) {
                if (i > 0) {
                  arr[i].hassign = 0;
                }
              }
            } else {
              arr[that.data.has_signnum].hassign = 1;
            }
            console.log(arr);
            that.setData({
              signin: 1,
              signstar: arr,
              gold: that.data.gold + value.data.gold,
              has_signnum: that.data.has_signnum == 7?1:that.data.has_signnum + 1
            })
          }
          if (value.code == 454) {
            wx.showToast({
              title: '重复签到',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          console.log('获取首页信息失败');
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 战力数字滚动
   */
  battlenumscroll: function (res) {
    var that = this;
    that.setData({
      gold: that.data.gold + res
    })
    // var batstr = res.toString();
    // var battlearr = [];
    // var recordbattle = res;
    // for (var k = 0; k < batstr.length; k++) {
    //   setTimeout(function (k) {
    //     return function () {
    //       battlearr.push(recordbattle % 10);
    //       recordbattle = parseInt(recordbattle / 10);
    //       if (battlearr[k] !== 0) {
    //         for (var j = 1; j <= battlearr[k]; j++) {
    //           setTimeout(function (j) {
    //             return function () {
    //               that.setData({
    //                 gold: that.data.gold + Math.pow(10, k)
    //               })
    //             }
    //           }(j), j * 100)
    //         }
    //       }
    //     }
    //   }(k), k * 80)
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      masklayer: true,//遮罩层默认关闭
      user: {},//用户信息
      gold: 0,//总金币
      money: 0,//总钱
      gamelist: [],//游戏列表
      signin: 0,//是否签到
      has_signnum: 0,//已经签到的天数
      signstar: [],
      hastoken: 0,//是否授权
      event: 0,//弹框事件
      contactparams: '',
      invitefriendgold: 0,//邀请好友获得的战力
      partlotterygold: 0,//参与抽奖获得的战力
      playgamebattle: 0,//试玩游戏获得的战力
      invitefriend: 0,//参与邀请好友任务状态
      invitegold: 0,//领取邀请好友的奖励
      partinlottery: 0,//参与抽奖任务状态
      lotterygold: 0,//领取参与抽奖的获取的奖励
      has_signnum: 0,//已签到次数
      getgoldnum1: 0,//领取玩游戏的奖励
      playgame_getgold1: 0,//完成玩游戏任务状态
      getgoldnum2: 0,//领取玩游戏的奖励
      playgame_getgold2: 0,//完成玩游戏任务状态
      hasplay_gamenum: 0,//玩游戏任务的进度
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
    if(that.data.userid) {//已经加密,不符合上述两种情况，分享
      return {
        title: '每天免费抽现金红包，各种大奖等你来拿!',
        path: 'pages/lottery/lottery?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_lottery1.jpg'
      }
    }else{//未登录状态分享
      return {
        title: '每天免费抽现金红包，各种大奖等你来拿!',
        path: 'pages/lottery/lottery',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_lottery1.jpg'
      }
    }
  }
})