// pages/lottery/lottery.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    eventtype:0,//弹框事件类型
    turnbale_eventtype: 0,//转盘抽奖弹框
    hastoken:0,//是否登录
    userid: '',//加密过的用户id
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gift1: {},
    gift2: {},
    gift3: {},
    gift4: {},
    gift5: {},
    gift6: {},
    gift7: {},
    gift8: {},
    Frequent_clicks:0,//预防频繁点击
    redemption: [],//某用户兑换成功记录
    gamelist: [],//游戏列表
    playresult:0,//试玩游戏的结果
    goodsdetail: [],
    gamelist: [],
    mygold: 0,
    mymoney: 0,
    game_gold:0,
    remaindraws: 1,//只要是大于0就可以，为了启动立即抽奖的遮罩
    winproinfo:''//抽中奖的商品的信息
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
    var data = { token: token};//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmrank.boc7.net/v1_lotteryIndex',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if(value.code==0){
          that.setData({
            redemption:value.data.exchange,
            goodsdetail:value.data.goods,
            gamelist:value.data.game,
            game_gold:value.data.game_gold,
            userid: token?value.data.uid:0,
            mygold: token ? value.data.gold : 0,
            remaindraws: token ? value.data.gold : 0,
            mymoney: token?value.data.money:0.00,
            hastoken: token?1:0
          });
        }else{
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
        console.log('获取抽奖活动失败');
      }
    })
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
   * 用户关闭组队中奖提示框
   */
  closeteamtip: function (e) {
    this.setData({
      teamwintip: !this.data.teamwintip
    })
  },

  /**
   * 领取奖励弹框
   */
  submitredempt: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 4,
      prize_type:1
    })
  },

  /**
   * 事件弹出提示框集合
   */
  // eventtipset: function (e) {
  //   console.log(e.currentTarget.dataset);
  //   if (e.currentTarget.dataset){
  //     if (e.currentTarget.dataset.eventtype == 4) {
  //       this.setData({
  //         eventtype: e.currentTarget.dataset.eventtype
  //       })
  //     } else {
  //       this.setData({
  //         masklayer: !this.data.masklayer,
  //         eventtype: e.currentTarget.dataset.eventtype
  //       })
  //     }
  //     if (e.currentTarget.dataset.prizetype){
  //       this.setData({
  //         prize_type: e.currentTarget.dataset.prizetype
  //       })
  //     }
  //   }
  // },

  randomlottery: function (e) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (token) {
      that.setData({
        Frequent_clicks: 1//预防频繁点击
      });
      setTimeout(function () {
        that.setData({
          Frequent_clicks: 0//预防频繁点击
        });
      }, 3000);
      if (that.data.mygold < 10) {
        console.log(1);
        that.setData({
          masklayer: !that.data.masklayer,
          eventtype: 2
        });
      } else {
        var data = { token: token };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmrank.boc7.net/v2_lottery',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              var giftscale1 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale2 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale3 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale4 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale5 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale6 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale7 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale8 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              giftscale1.scale(1.08, 1.08).step();
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 100 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 200 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 300 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 400 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 500 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 600 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              giftscale1.scale(1.08, 1.08).step({ delay: 700 });
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 700 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 700 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 700 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 700 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 700 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 700 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              giftscale1.scale(1.08, 1.08).step({ delay: 700 });
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 700 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 700 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 700 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 700 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 700 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 700 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              that.setData({
                gift1: giftscale1.export(),
                gift2: giftscale2.export(),
                gift3: giftscale3.export(),
                gift4: giftscale4.export(),
                gift5: giftscale5.export(),
                gift6: giftscale6.export(),
                gift7: giftscale7.export(),
                gift8: giftscale8.export(),
              });
              setTimeout(function () {
                if (value.data.send_way == 2 || value.data.send_way == 6) {
                  that.setData({
                    eventtype: 4,
                    turnbale_eventtype: 3,
                    masklayer: !that.data.masklayer,
                    remaindraws: value.data.gold,
                    mygold: value.data.gold
                  })//现金
                } else if (value.data.send_way == 3) {
                  that.setData({
                    eventtype: 4,
                    turnbale_eventtype: 2,
                    masklayer: !that.data.masklayer,
                    remaindraws: value.data.gold,
                    mygold: value.data.gold
                  })//金币
                } else if (value.data.send_way == 4) {
                  that.setData({
                    eventtype: 3,
                    masklayer: !that.data.masklayer,
                    remaindraws: value.data.gold,
                    mygold: value.data.gold
                  })//未中奖
                } else if (value.data.send_way == 5) {
                  that.setData({
                    eventtype: 4,
                    turnbale_eventtype: 1,
                    masklayer: !that.data.masklayer,
                    remaindraws: value.data.gold,
                    mygold: value.data.gold
                  })//京东
                }
                for (var i = 0; i < that.data.goodsdetail.length; i++) {
                  if (that.data.goodsdetail[i].goods_id == value.data.goods_id) {
                    that.setData({
                      winproinfo: that.data.goodsdetail[i].goods_name
                    });
                    if (value.data.send_way == 2) {
                      console.log(that.data.goodsdetail[i].goods_name);
                      that.setData({
                        mymoney: (parseFloat(that.data.mymoney) + parseFloat(that.data.goodsdetail[i].goods_name)).toFixed(2)
                      });//现金
                    } else if (value.data.send_way == 6) {
                      console.log(that.data.goodsdetail[i].goods_name);
                      that.setData({
                        winproinfo: value.data.money + '元',
                        mymoney: (parseFloat(that.data.mymoney) + parseFloat(value.data.money)).toFixed(2)
                      });//现金
                    }
                  }
                }
              }, 2500);
            } else if (value.code == 401) {
              that.setData({
                masklayer: !that.data.masklayer,
                eventtype: 2
              });
            } else {
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              });
            }
          }, fail: function (res) {
            console.log('获取用户id失败');
          }
        });
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 兑换信息提交
   */
  submitinfo: function (e) {
    var that = this;
    that.setData({
      submitswitch: 2
    })//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
    setTimeout(function () {
      that.setData({
        submitswitch: 1
      })//随机赋值没有任何意义，为了在第一时间将提交按钮变为可点击
    }, 6000);
    if (e.detail.value.input3.length < 5 || !parseInt(e.detail.value.input3)) {
      wx.showToast({
        title: 'QQ信息格式不正确，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      var token = wx.getStorageSync('token');
      var data = {};
      if (that.data.prize_type == 1) {
        data = {
          token: token,
          id: that.data.lotteryid,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/dayPrizeExchange',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              that.setData({
                masklayer: !that.data.masklayer
              })
            } else {
              console.log(value.msg);
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log('提交失败');
          }
        });
      } else {
        data = {
          token: token,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/addLotteryInfo',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              that.setData({
                masklayer: !that.data.masklayer
              })
            } else {
              console.log(value.msg);
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log('提交失败');
          }
        });
      }
    }
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
      });
    }else{
      setTimeout(function () {
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
                    }
                    that.setData({
                      masklayer: !that.data.masklayer,
                      eventtype: 1,
                      playresult: 1,
                      gamelist: arr
                    })
                  }
                  if (value.code == 403){
                    that.setData({
                      masklayer: !that.data.masklayer,
                      eventtype: 1,
                      playresult: 2
                    })
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
                  that.setData({
                    masklayer: !that.data.masklayer,
                    eventtype: 1,
                    playresult: 0
                  })
                }
              }
            }
          }, 1000);
        }
      }, 5000);
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
    this.myreload();
  },

  /**
   * 刷新页面
   */
  myreload: function () {
    this.setData({
      masklayer: true,//遮罩层默认关闭
      eventtype: 0,//弹框事件类型
      turnbale_eventtype: 0,//转盘抽奖弹框
      hastoken: 0,//是否登录
      userid: '',//加密过的用户id
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      gift1: {},
      gift2: {},
      gift3: {},
      gift4: {},
      gift5: {},
      gift6: {},
      gift7: {},
      gift8: {},
      Frequent_clicks: 0,//预防频繁点击
      redemption: [],//某用户兑换成功记录
      gamelist: [],//游戏列表
      playresult: 0,//试玩游戏的结果
      goodsdetail: [],
      gamelist: [],
      mygold: 0,
      mymoney: 0,
      game_gold: 0,
      remaindraws: 1,//只要是大于0就可以，为了启动立即抽奖的遮罩
      winproinfo: ''//抽中奖的商品的信息
    })
    this.onLoad(this.options);
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
    this.myreload();
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