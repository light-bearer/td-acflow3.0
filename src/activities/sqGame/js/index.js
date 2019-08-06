(function() {
  //   FastClick.attach(document.body);
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

  $(".masker ,.close-popup").on("click", () => {
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
    }
  });
})();
