(function() {
  FastClick.attach(document.body);
  var limit = 10,
    sendCurPage = 1,
    receiveCurPage = 1,
    hasSendList = false,
    hasReceiveList = false;
  $("#back").on("click", function() {
    history.back();
  });

  function init() {
    getSendList();
  }
  init();

  function getSendList() {
    Util.Ajax({
      url: Util.openAPI + "/app/roomCard/getSendList",
      type: "get",
      data: {
        limit: limit,
        page: sendCurPage
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
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
          if (sendCurPage === 1) {
            hasSendList = sendList && sendList.length > 0;
            $('.send-list').html(temp);
          } else {
            $('.send-list').append(temp);
          }
        } else {
          Util.toast("获取发送房卡列表失败，请稍后重试");
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取发送房卡列表失败，请稍后重试");
      }
    });
  }

  function getReceiveList() {
    Util.Ajax({
      url: Util.openAPI + "/app/roomCard/getReceiveList",
      type: "get",
      data: {
        limit: limit,
        page: sendCurPage
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
          if (receiveCurPage === 1) {
            hasReceiveList = receiveList && receiveList.length > 0;
            $('.receive-list').html(temp);
          } else {
            $('.receive-list').append(temp);
          }
        } else {
          Util.toast("获取发送房卡列表失败，请稍后重试");
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取发送房卡列表失败，请稍后重试");
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
    if (index === 0 && !hasSendList) {
      getSendList();
      return;
    }
    if (index === 1 && !hasReceiveList) {
      getReceiveList();
    }
  });
})();
