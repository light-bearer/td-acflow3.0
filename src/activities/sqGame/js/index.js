(function() {
  FastClick.attach(document.body);
  var openId = Util.getParam("openId"), // 登录后返回相关openid
    code = Util.getParam("code"); // 授权code

  /** 主要初始化 */
  auth(code, function(token) {
    getUserInfo();
    bindEvent();
  });
  /** bind event */
  function bindEvent() {
    //防外挂
    $(".main-fwg").on("click", function() {
      console.info("fwg---");
    });

    //打开个人中心
    $(".main-user").on("click", function() {
      // console.info("user----");
      $(".main-item-list").hide();
      $(".main-user-center").show();
    });
    //   $(".main-user").trigger("click");
    //关闭个人中心
    $(".close-user").on("click", function() {
      $(".main-user-center").hide();
      $(".main-item-list").show();
    });
    //群主管理开关
    $("#switchItems").on("change", function(e) {
      // console.info("change=----", $(e.currentTarget).is(":checked"));
      let isChecked = $(e.currentTarget).is(":checked");
      if (isChecked) {
        $(".manage-wraper").show();
      } else {
        $(".manage-wraper").hide();
      }
    });

    $(".main-item-list").on("click", ".main-item", function(e) {
      let type = $(e.currentTarget).attr("data-type");
      console.info("kkkk--", type);
      $(".create-room-popup").show();
    });

    $(".masker ,.close-popup ,.close-popup-record").on("click", function() {
      // $(".create-room-popup").hide();
      $(".popup-wrapper").hide();
    });

    $(".main-user-center").on("click", ".uc-item", function(e) {
      let type = $(e.currentTarget).attr("data-type");
      switch (type) {
        case "sendCard":
          //发送房卡
          var baseInfo = Util.getSession([Util.baseInfo]);
          $(".popup-send").find("#pop_send_room_count").html(baseInfo.roomCount);
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

    $('.popup-send').on('click', '#btn_make_gift', function(e) {
      var count = $('#input_roomcard').val();
      var baseInfo = Util.getSession([Util.baseInfo])
      if (count > baseInfo.roomCount) {
        Util.toast('您的房卡不足！');
        return;
      }
    });
  }

  /** method */
  function auth(code, cb) {
    // 若code 不为空，说明授权成功， 获取用户信息
    if (code) {
      Util.Ajax({
        url: Util.openAPI + "/app/authUserInfo",
        type: "get",
        data: {
          code: code
        },
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          console.log(data);
          if (data.code === 0) {
            // window.sessionStorage['TOKEN'] = data.data.token
            Util.setSession([Util.token], 1234)
            cb && cb(data.data.token)
          } else {
            Util.toast("授权失败，请重新尝试");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("授权失败，请重新尝试");
        }
      });
      return;
    }
    // 若code为空，那么进行微信授权
    var _url = window.location.href;
    window.location.href = Util.openAPI + "/app/redirectUrl?url=" + _url; // 带上重定向地址
    return;
  }
  // 获取用户信息
  function getUserInfo() {
    Util.Ajax({
      url: Util.openAPI + "/app/newUser/baseInfo",
      type: "get",
      data: {},
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          // console.log(data.data)
          // 设置个人信息
          var _data = data.data
          Util.setSession([Util.baseInfo], _data);
          var $baseinfo = $('#base_info');
          $baseinfo.find('.header-title').html(_data.nickName);
          $baseinfo.find('.header-id').html('ID:' + _data.memberNumber);
          $baseinfo.find('.header-num').html(_data.roomCount);

          if (_data.sign) {
            $('#sign').html(_data.sign)
          } else {
            // TODO 弹窗提示输入签名

          }
        } else {
          Util.toast("获取个人信息失败，请重新登录");
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取个人信息失败，请重新登录");
      }
    });
  }
})();
