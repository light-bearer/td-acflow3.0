(function() {
  FastClick.attach(document.body);
  var roomCardId = Util.getParam("roomCardId"),
    code = Util.getParam("code"); // 授权code

  /** 主要初始化 */
  (function() {
    var baseInfo = Util.getSession(Util.baseInfo),
      token = Util.getSession(Util.token);
    if (baseInfo && token) {
      bindEvent();
    } else {
      Util.auth(code, function(token) {
        Util.getUserInfo(function() {});
        bindEvent();
      });
    }
  })();

  function bindEvent() {
    function init() {
      Util.Ajax({
        url: Util.openAPI + "/app/roomCard/get",
        type: "get",
        data: {
          id: roomCardId
        },
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          //   console.log(data);
          if (data.code === 0) {
            var data = data.data;
            if (+data.state === 0) {
              $(".g-p-avator").src = data.sendImg;
              $(".gift-txt-name").html(data.sendNickName);
              $("#popTxt").html(
                "您获得" + data.sendNickName + "的" + data.roomCount + "个房卡"
              );
            } else {
              var $receivedDom = $(".received-content");
              $receivedDom.find(".g-reveived-avator").src = data.sendImg;
              $receivedDom.find(".g-received-nam").html(data.sendNickName);
              $receivedDom.find(".txt-num").html(data.roomCount);
              $receivedDom.find("#receiverImg").src = data.receiveImg;
              $receivedDom.find("#receiverName").html(data.receiveNickName);
              $receivedDom.find("#receiveTime").html(data.receiveTime);
              $(".mc-content").hide();
              $(".received-content").show();
            }
          } else {
            Util.toast("获取礼盒信息失败");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("获取礼盒信息失败");
        }
      });
    }
    init();
    /**
     * 领取房卡
     */
    $(".icon-gift").on("click", function() {
      Util.Ajax({
        url: Util.openAPI + "/app/roomCard/receive",
        type: "post",
        data: {
          id: roomCardId
        },
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          //   console.log(data);
          if (data.code === 0) {
            $(".popup-get").show();
          } else {
            Util.toast("领取礼盒失败");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("领取礼盒失败");
        }
      });
    });
    $(".icon-back-arrow, .gift-btn-back").on("click", function() {
      location.href = "./index.html?code=" + ConvolverNode;
    });

    // 微信分享
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: "", // 必填，企业号的唯一标识，此处填写企业号corpid
      timestamp: "", // 必填，生成签名的时间戳
      nonceStr: "", // 必填，生成签名的随机串
      signature: "", // 必填，签名，见附录1
      jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    wx.onMenuShareTimeline({
      title: "", // 分享标题
      link: "", // 分享链接，该链接域名必须与当前企业的可信域名一致
      imgUrl: "", // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
    //获取“分享给朋友”按钮点击状态及自定义分享内容接口
    wx.onMenuShareAppMessage({
      title: "", // 分享标题
      desc: "", // 分享描述
      link: "", // 分享链接，该链接域名必须与当前企业的可信域名一致
      imgUrl: "", // 分享图标
      type: "", // 分享类型,music、video或link，不填默认为link
      dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  }
})();
