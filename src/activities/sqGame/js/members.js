(function() {
  FastClick.attach(document.body);
  var membersScroll = null,
    curSearch = "";
  // Util.toast('11111', 1000000);

  /**
   * 初始化meScroll
   */
  (function() {
    var config = $.extend(
      true,
      {
        up: { callback: getGroupUserList }
      },
      Util.baseListConfig
    );

    membersScroll = new MeScroll("membersScroll", config);
  })();

  function getGroupUserList(page) {
    Util.Ajax({
      url: Util.openAPI + "/app/groupUser/getGroupUserList",
      type: "get",
      data: {
        limit: page.size,
        page: page.num,
        nickName: curSearch
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          var rows = data.data.rows;
          var temp = "";
          rows &&
            rows.forEach(function(item) {
              temp +=
                '<li class="mc-item"><div class="mc-avator-wrapper" data-state="' +
                item.state +
                '"><img src="' +
                item.userImg +
                '" /><i class="mark-shield"></i><i class="mark-green"></i></div>' +
                '<div class="mc-item-det"><p class="member-name member-txt">' +
                item.userNickName +
                '</p><p class="member-id member-txt">ID:' +
                item.userId +
                "</p> </div>" +
                '<div class="member-btn-wrapper"><div class="btn-member" data-state="' +
                item.state +
                '"><div class="bg-bubble" data-state="' +
                item.state +
                '" data-isgroup="' +
                item.isGroup +
                '" data-groupid="' +
                item.groupId +
                '">' +
                '<i class="btn-reject member-opt" data-type="reject"></i><i class="btn-agree member-opt" data-type="agree"></i>' +
                '<i class="btn-manager member-opt" data-type="manager"></i><i class="btn-shield member-opt" data-type="shield"></i>' +
                '<i class="btn-reset-shield member-opt" data-type="reset"></i><i class="btn-out member-opt" data-type="out"></i></div></div></div></li>';
            });
          membersScroll.endBySize(rows.length, data.data.total);
          if (page.num === 1) {
            $(".members-list").html(temp);
          } else {
            $(".members-list").append(temp);
          }
        } else {
          Util.toast("获取战绩列表失败，请稍后重试");
          membersScroll.endErr();
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取战绩列表失败，请稍后重试");
        membersScroll.endErr();
      }
    });
  }

  $("#back").on("click", function() {
    history.back();
  });

  $(".members-list").on("click", ".btn-member", function(e) {
    var $target = $(this);
    var state = $target.attr("data-state");
    // -1、拒绝加入；不返回数据，没操作
    if (state !== "-1") {
      if ($target.hasClass("active")) {
        $target.removeClass("active");
      } else {
        $target.addClass("active");
      }
    }
  });

  $(".btn-search").on("click", function() {
    curSearch = $(".m-search-input").val();
    membersScroll.resetUpScroll(); //重新搜索,重置列表数据
  });

  $(".members-list").on("click", ".member-opt", function(e) {
    var $target = $(this),
      $parent = $target.parent(),
      type = $target.attr("data-type"),
      isGroup = $parent.attr("data-isgroup"),
      state = $parent.attr("data-state"),
      groupId = $parent.attr("data-groupid");

    switch (type) {
      case "reject" || "out":
        //拒绝或者踢出
        state = -1;
        break;
      case "agree":
        //同意
        state = 1;
        break;
      case "manager":
        if (+isGroup === "1") {
        } else {
          isGroup = 1;
        }
        //设为管理
        break;
      case "shield":
        state = 2;
        //屏蔽
        break;
      case "reset":
        //取消屏蔽
        break;
      // case "out":
      //   //踢出
      //   break;
    }
    Util.Ajax({
      url: Util.openAPI + "/app/groupUser/action",
      type: "post",
      data: {
        id: groupId,
        state: state,
        isGroup: isGroup
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          $(".btn-search").trigger("click");
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("状态修改失败，请稍后重试");
      }
    });
  });
})();
