(function() {
  FastClick.attach(document.body);
  var openId = Util.getParam("openId"), // 登录后返回相关openid
    code = Util.getParam("code"); // 授权code

  /** 主要初始化 */
  auth(code, function(openId) {
    bindEvent();
  });
  /** bind event */
  function bindEvent() {
    //防外挂
    $(".main-fwg").on("click", () => {
      console.info("fwg---");
    });

    //打开个人中心
    $(".main-user").on("click", () => {
      // console.info("user----");
      $(".main-item-list").hide();
      $(".main-user-center").show();
    });
    //   $(".main-user").trigger("click");
    //关闭个人中心
    $(".close-user").on("click", () => {
      $(".main-user-center").hide();
      $(".main-item-list").show();
    });
    //群主管理开关
    $("#switchItems").on("change", e => {
      // console.info("change=----", $(e.currentTarget).is(":checked"));
      let isChecked = $(e.currentTarget).is(":checked");
      if (isChecked) {
        $(".manage-wraper").show();
      } else {
        $(".manage-wraper").hide();
      }
    });

    $(".main-item-list").on("click", ".main-item", e => {
      let type = $(e.currentTarget).attr("data-type");
      console.info("kkkk--", type);
      $(".create-room-popup").show();
    });

    $(".masker ,.close-popup ,.close-popup-record").on("click", () => {
      // $(".create-room-popup").hide();
      $(".popup-wrapper").hide();
    });

    $(".main-user-center").on("click", ".uc-item", e => {
      let type = $(e.currentTarget).attr("data-type");
      switch (type) {
        case "sendCard":
          //发送房卡
          $(".popup-send").show();
          break;
        case "myCard":
          //我的房卡
          location.href = "./myCard.html";
          break;
        case "record":
          //查看战绩
          $(".popup-record").show();
          break;
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
          openId = data.id;
          cb && cb(openId);
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
})();
