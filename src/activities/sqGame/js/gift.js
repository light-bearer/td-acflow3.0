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
      location.href = "./index.html?code=" + code;
    });

    // 设置分享数据
    setShareData(
      window.location.origin + window.location.pathname + "?groupId=" + groupId
    );
    // 设置分享数据
    function setShareData(shareUrl) {
      Util.wxConfig(function() {
        var shareData = {
          title: "闲玩房卡礼包",
          desc: "闲玩房卡礼包",
          link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: window.location.href.split("/html/")[0] + "/images/share.png",
          success: function() {
            // 用户点击了分享后执行的回调函数
          }
        };
        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareTimeline(shareData);
        // wx.updateTimelineShareData(shareData);

        //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareAppMessage(shareData);
        // wx.updateAppMessageShareData(shareData);
        // showDialog();
      });
    }
  }
})();
