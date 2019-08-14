(function() {
  FastClick.attach(document.body);
  // var limit = 10,
  //   sendCurPage = 1,
  //   receiveCurPage = 1,
  //   hasSendList = false,
  //   hasReceiveList = false;
  var sendScroll = null,
    receiveScroll = null;
  $("#back").on("click", function() {
    history.back();
  });

  function init() {
    // getSendList();
    initList();
  }
  init();

  function initList() {
    var sendConfig = $.extend(
      true,
      {
        up: { callback: getSendList }
      },
      Util.baseListConfig
    );
    var receiveConfig = $.extend(
      true,
      {
        up: {
          callback: getReceiveList
        }
      },
      Util.baseListConfig
    );
    sendScroll = new MeScroll("sendScroll", sendConfig);
    receiveScroll = new MeScroll("receiveScroll", receiveConfig);
  }

  function getSendList(page) {
    console.info("senlist---", page);
    Util.Ajax({
      url: Util.openAPI + "/app/roomCard/getSendList",
      type: "get",
      data: {
        limit: page.size,
        page: page.num
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          var sendList = data.data.rows;
          var temp = "";

          sendList.forEach(function(item) {
            var img = item.receiveImg
              ? item.receiveImg
              : "../images/bg_avator.png";
            temp +=
              '<li class="mc-item"><div class="mc-avator-wrapper">' +
              '<img src="' +
              img +
              '" /></div>' +
              '<div class="mc-item-det"><p class="mc-item-name">' +
              item.receiveNickName +
              "</p>" +
              '<p class="mc-item-time">' +
              item.receiveTime +
              "</p>" +
              '<p class="mc-item-num">发出了<span class="num">' +
              item.roomCount +
              "</span>房卡</p></div></li>";
          });
          sendScroll.endBySize(sendList.length, data.data.total); //必传参数(当前页的数据个数, 总数据量)

          if (page.num === 1) {
            // hasSendList = sendList && sendList.length > 0;
            $(".send-list").html(temp);
          } else {
            $(".send-list").append(temp);
          }
        } else {
          Util.toast("获取发送房卡列表失败，请稍后重试");
          sendScroll.endErr();
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取发送房卡列表失败，请稍后重试");
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        sendScroll.endErr();
      }
    });
  }

  function getReceiveList(page) {
    Util.Ajax({
      url: Util.openAPI + "/app/roomCard/getReceiveList",
      type: "get",
      data: {
        limit: page.size,
        page: page.num
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          var receiveList = data.data.rows;
          var temp = "";
          receiveList.forEach(function(item) {
            var img = item.sendImg ? item.sendImg : "../images/bg_avator.png";
            temp +=
              '<li class="mc-item"><div class="mc-avator-wrapper">' +
              '<img src="' +
              img +
              '" /></div>' +
              '<div class="mc-item-det"><p class="mc-item-name">' +
              item.sendNickName +
              "</p>" +
              '<p class="mc-item-time">' +
              item.sendTime +
              "</p>" +
              '<p class="mc-item-num">收到了<span class="num">' +
              item.roomCount +
              "</span>房卡</p></div></li>";
          });
          receiveScroll.endBySize(receiveList.length, data.data.total); //必传参数(当前页的数据个数, 总数据量)

          if (page.num === 1) {
            // hasReceiveList = receiveList && receiveList.length > 0;
            $(".receive-list").html(temp);
          } else {
            $(".receive-list").append(temp);
          }
        } else {
          Util.toast("获取发送房卡列表失败，请稍后重试");
          receiveScroll.endErr();
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取发送房卡列表失败，请稍后重试");
        receiveScroll.endErr();
      }
    });
  }

  $(".mc-btn-wrapper").on("click", "a", function() {
    var $target = $(this);
    $target
      .parent()
      .find("a")
      .removeClass("active");
    $target.addClass("active");
    var index = $target.index();
    var transDistance = index * -100;
    $(".list-wrapper").css("transform", "translate(" + transDistance + "%, 0)");
    // if (index === 0 && !hasSendList) {
    //   getSendList();
    //   return;
    // }
    // if (index === 1 && !hasReceiveList) {
    //   getReceiveList();
    // }
  });
})();
