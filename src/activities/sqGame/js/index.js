(function() {
  FastClick.attach(document.body);
  var openId = Util.getParam("openId"), // 登录后返回相关openid
    code = Util.getParam("code"); // 授权code
  var curGameId = "";

  /** 主要初始化 */
  (function() {
    var baseInfo = Util.getSession(Util.baseInfo),
      token = Util.getSession(Util.token);
    if (baseInfo && token) {
      initBaseInfo(baseInfo);
      bindEvent();
    } else {
      Util.auth(code, function(token) {
        Util.getUserInfo(function(data) {
          initBaseInfo(data);
        });
        bindEvent();
      });
    }
  })();

  function initBaseInfo(_data) {
    var $baseinfo = $("#base_info");
    $baseinfo.find(".header-title").html(_data.nickName);
    $baseinfo.find(".header-id").html("ID:" + _data.memberNumber);
    $baseinfo.find(".header-num").html(_data.roomCount);
    if (_data.img) $baseinfo.find(".main-avator").src = _data.img;

    if (_data.sign) {
      $("#sign").html(_data.sign);
    } else {
      // TODO 弹窗提示输入签名
      $(".popup-edit-sign").show();
    }
  }
  /** bind event */
  function bindEvent() {
    /**
     * 页面初始化
     */
    function init() {
      var pageType = Util.getParam("pageType");
      if (pageType === "userCenter") {
        // $(".main-item-list").hide();
        // $(".main-user-center").show();
        triggerPages(".main-user-center");
      } else {
        // $(".main-item-list").show();
        // $(".main-user-center").hide();
        triggerPages(".main-item-list");
      }
      //防止返回时checkbox状态与群主管理内容显示不一致
      var $checkbox = $(".switch-checkbox");
      triggerManage($checkbox);
      getGameList();
    }
    init();
    //获取游戏列表
    function getGameList() {
      Util.Ajax({
        url: Util.openAPI + "/app/game/getGameList",
        type: "get",
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          // console.log(data);
          if (data.code === 0) {
            var temp = "";
            data.data &&
              data.data.forEach(function(item) {
                temp +=
                  '<li class="main-item"><img src="' +
                  item.img +
                  '"> <div class="item-btn" data-id="' +
                  item.id +
                  '">创建房间</div> </li>';
              });
            $(".main-item-list").html(temp);
          } else {
            Util.toast("获取游戏列表失败");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("获取游戏列表失败");
        }
      });
    }
    // $(".main-item-list").on("click", ".main-item", function(e) {
    //   var type = $(e.currentTarget).attr("data-type");
    //   console.info("kkkk--", type);
    //   $(".create-room-popup").show();
    // });
    //点击游戏列表中的创建房间按钮
    $(".main-item-list").on("click", ".item-btn", function(e) {
      var id = $(this).attr("data-id");
      Util.getParamsOfGame(id, function(temp) {
        $(".cr-content").html(temp);
      });
      curGameId = id;
      $(".create-room-popup").show();
    });
    
    
    /**
     * 切换首页及个人中心的显示
     * @param {*} selector  当前显示页面的选择器
     */
    function triggerPages(selector) {
      $(".main-list").removeClass("active");
      $(selector).addClass("active");
    }
    //防外挂
    $(".main-fwg").on("click", function() {
      // var baseInfo = Util.getSession(Util.baseInfo);
      // if (!baseInfo.sign) {
      //   $(".popup-edit-sign").show();
      // } else {
      //   showUserInfo(baseInfo);
      // }
      var antiPlug = new AntiPlug();
      antiPlug.show();
    });
    // 修改签名按钮事件
    // $(".es-btn").on("click", function() {
    //   var type = $(this).attr("data-type");
    //   var signValue = $("#signInput").val();

    //   if (type === "show") {
    //     if (!signValue) return;
    //     $(".sign-sumbit-wrapper").show();
    //     return;
    //   }
    //   if (type === "cancle") {
    //     $(".popup-edit-sign").hide();
    //     $("#signInput").val("");
    //     $(".sign-sumbit-wrapper").hide();
    //     return;
    //   }
    //   if (type === "submit") {
    //     // updateSign(signValue);
    //     Util.updateSign(signValue);
    //   }
    // });
    // // function updateSign(val) {
    //   Util.Ajax({
    //     url: Util.openAPI + "/app/newUser/updateSign",
    //     type: "POST",
    //     data: {
    //       sign: val
    //     },
    //     dataType: "json",
    //     cbOk: function(data, textStatus, jqXHR) {
    //       console.log(data);
    //       if (data.code === 0) {
    //         // window.sessionStorage['TOKEN'] = data.data.token
    //         Util.setSession(Util.token, 1234);
    //       } else {
    //         Util.toast("修改签名失败，请重新尝试");
    //       }
    //     },
    //     cbErr: function(e, xhr, type) {
    //       Util.toast("修改签名失败，请重新尝试");
    //     }
    //   });
    // }

    // function showUserInfo(info) {
    //   // var info = Util.getSession(Util.baseInfo);
    //   //   console.info(info)
    //   if (!info) return;
    //   var $fwgInfo = $("#fwgInfo");
    //   $fwgInfo.find("#fwgAvator").src = info.img;
    //   $fwgInfo.find("#fwgName").html(info.nickName);
    //   $fwgInfo.find("#fwgIdfwgId").html("ID:" + info.memberNumber);
    //   $fwgInfo.find("#fwgLevel").html(info.level + "级");
    //   $fwgInfo.find(".sign-txt").html(info.sign);
    //   $(".popup-info").show();
    // }

    //打开个人中心
    $(".main-user").on("click", function() {
      //   $(".main-item-list").hide();
      //   $(".main-user-center").show();
      if (!Util.getParam("pageType")) {
        var _url = window.location.href;
        if (_url.indexOf("?") > -1) {
          window.location.href = _url + "&pageType=userCenter";
        } else {
          window.location.href = _url + "?pageType=userCenter";
        }
      }
    });
    //   $(".main-user").trigger("click");
    //关闭个人中心
    $(".close-user").on("click", function() {
      //   $(".main-user-center").hide();
      //   $(".main-item-list").show();
      history.back();
    });
    //群主管理开关
    $("#switchItems").on("change", function(e) {
      // console.info("change=----", $(e.currentTarget).is(":checked"));
      //   var isChecked = $(e.currentTarget).is(":checked");
      //   if (isChecked) {
      //     $(".manage-wraper").show();
      //   } else {
      //     $(".manage-wraper").hide();
      //   }
      var target = $(e.currentTarget);
      triggerManage(target);
    });
    function triggerManage(target) {
      var isChecked = target.is(":checked");
      if (isChecked) {
        $(".manage-wraper").show();
      } else {
        $(".manage-wraper").hide();
      }
    }
    //创建房间
    $(".btn-cr").on("click", function(e) {
      // location.href = "./gameAnbao.html";
      // return;
      var roomParams = {
        chip: $('input[name="chips"]:checked').val(),
        chipLimit: $('input[name="chipLimits"]:checked').val(),
        people: $('input[name="peoples"]:checked').val(),
        betTime: $('input[name="betTimes"]:checked').val(),
        gameId: curGameId,
        playOdds: "",
        type: $(".btns-wapper")
          .find(".active")
          .eq(0)
          .attr("data-type")
      };
      var $playOddsEle = $(".playOdds:checked"),
        gameNumberRoomCard = $(
          'input[name="gameNumberOfGameList"]:checked'
        ).val();
      if (gameNumberRoomCard) {
        var arr = gameNumberRoomCard.split(",");
        roomParams.numberOfGame = arr[0];
        roomParams.roomCard = arr[1];
      }
      if ($playOddsEle) {
        var playOdds = [];
        // playOdds = {};
        for (var i = 0, eleLength = $playOddsEle.length; i < eleLength; i++) {
          // console.info("elem--", $playOddsEle.eq(i));
          var idOdds = $playOddsEle
            .eq(i)
            .val()
            .split(",");

          playOdds.push(
            JSON.stringify({
              gamePlayId: parseInt(idOdds[0]),
              odds: parseFloat(idOdds[1])
            })
          );
          // playOdds[idOdds[0]] = idOdds[1];
        }
        // roomParams.playOdds = playOdds;
        // roomParams.playOdds = JSON.stringify(playOdds);
        roomParams.playOdds = "[" + playOdds.join(",") + "]";
      }
      // console.info("roomParams---", roomParams);
      Util.Ajax({
        url: Util.openAPI + "/app/room/createRoom",
        type: "post",
        data: roomParams,
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          // console.log(data);
          if (data.code === 0) {
            // Util.setSession("roomParams", data.data);
            var id = data.data.id;
            location.href = "./gameAnbao.html?id=" + id;
          } else {
            Util.toast(data.msg);
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("创建房间失败");
        }
      });
    });
    //关闭弹窗
    $(".masker ,.icon-close").on("click", function() {
      // $(".create-room-popup").hide();
      $(".popup-wrapper").hide();
    });

    $(".main-user-center").on("click", ".uc-item", function(e) {
      var type = $(e.currentTarget).attr("data-type");
      switch (type) {
        case "sendCard":
          //发送房卡
          var baseInfo = Util.getSession(Util.baseInfo);
          $(".popup-send")
            .find("#pop_send_room_count")
            .html(baseInfo.roomCount);
          //   $(".popup-send")
          //     .find("#input_roomcard")
          //     .attr("max", +baseInfo.roomCount);

          $(".popup-send").show();
          break;
        case "myCard":
          //我的房卡
          location.href = "./myCard.html";
          break;
        case "record":
          //查看战绩
          //   $(".popup-record").show();
          location.href = "./record.html";
          break;
      }
    });

    $(".manage-wraper").on("click", "i", function(e) {
      var type = $(e.currentTarget).attr("data-type");
      //   console.info("tpe----", type);
      if (type === "invite") {
        handleInvite();
        // location.href = "./invite.html";
        return;
      }
      if (type === "members") {
        location.href = "./members.html";
        return;
      }
      if (type === "record") {
        $(".popup-record").show();
        return;
      }
    });

    $(".popup-record").on("click", ".btn-submit", function(e) {
      location.href = "./record.html";
    });
    $(".popup-send").on("click", "#btn_make_gift", function(e) {
      var count = $("#input_roomcard").val();
      var baseInfo = Util.getSession(Util.baseInfo);
      if (count > baseInfo.roomCount) {
        Util.toast("您的房卡不足！");
        return;
      }
      $("#showNum").val(count);
      Util.Ajax({
        url: Util.openAPI + "/app/roomCard/send",
        type: "post",
        data: {
          roomCount: count
        },
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          console.log(data);
          if (data.code === 0) {
            location.href = "./gift.html?roomCardId=" + data.data.id;
          } else {
            Util.toast("发送房卡失败");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("发送房卡失败");
        }
      });
    });
    //创建房间时切换庄家
    $(".btns-wapper").on("click", "i", function(e) {
      var target = $(this);
      target.siblings().removeClass("active");
      target.addClass("active");
    });
  }

  // /** method */
  function handleInvite() {
    // location.href = "./invite.html";
    Util.Ajax({
      url: Util.openAPI + "/app/group/inviteUser",
      type: "post",
      data: {},
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          location.href = "./invite.html?groupId=" + data.data.id;
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("请求失败，请稍后再试");
      }
    });
  }
  // function auth(code, cb) {
  //   // 若code 不为空，说明授权成功， 获取用户信息
  //   if (code) {
  //     Util.Ajax({
  //       url: Util.openAPI + "/app/authUserInfo",
  //       type: "get",
  //       data: {
  //         code: code
  //       },
  //       dataType: "json",
  //       cbOk: function(data, textStatus, jqXHR) {
  //         console.log(data);
  //         if (data.code === 0) {
  //           // window.sessionStorage['TOKEN'] = data.data.token
  //           Util.setSession(Util.token, 1234);
  //           cb && cb(data.data.token);
  //         } else {
  //           Util.toast("授权失败，请重新尝试");
  //         }
  //       },
  //       cbErr: function(e, xhr, type) {
  //         Util.toast("授权失败，请重新尝试");
  //       }
  //     });
  //     return;
  //   }
  //   // 若code为空，那么进行微信授权
  //   var _url = window.location.href;
  //   window.location.href = Util.openAPI + "/app/redirectUrl?url=" + _url; // 带上重定向地址
  //   return;
  // }
  // // 获取用户信息
  // function getUserInfo() {
  //   Util.Ajax({
  //     url: Util.openAPI + "/app/newUser/baseInfo",
  //     type: "get",
  //     data: {},
  //     dataType: "json",
  //     cbOk: function(data, textStatus, jqXHR) {
  //       console.log(data);
  //       if (data.code === 0) {
  //         // console.log(data.data)
  //         // 设置个人信息
  //         var _data = data.data;
  //         Util.setSession(Util.baseInfo, _data);
  //         var $baseinfo = $("#base_info");
  //         $baseinfo.find(".header-title").html(_data.nickName);
  //         $baseinfo.find(".header-id").html("ID:" + _data.memberNumber);
  //         $baseinfo.find(".header-num").html(_data.roomCount);

  //         if (_data.sign) {
  //           $("#sign").html(_data.sign);
  //         } else {
  //           // TODO 弹窗提示输入签名
  //           $(".popup-edit-sign").show();
  //         }
  //       } else {
  //         Util.toast("获取个人信息失败，请重新登录");
  //       }
  //     },
  //     cbErr: function(e, xhr, type) {
  //       Util.toast("获取个人信息失败，请重新登录");
  //     }
  //   });
  // }
})();
