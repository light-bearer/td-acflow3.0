(function() {
  FastClick.attach(document.body);
  //1-邀请成员发出； 2-邀请加入；3加入申请
  var state = 1,
      groupId = Util.getParam('groupId'),
      userInfo = Util.getSession(Util.baseInfo);
  console.log(userInfo)
  
  init();
  $(".icon-close").on("click", function() {
    location.href = "./index.html";
  });

  /** method */
  function init() {
      getGroupInfo(groupId, function(data) {
        state = userInfo.id === data.id ? 1 : 2;
        $(".main-content").attr("data-state", state);
        $('#inivatee_avator').attr('src', userInfo.img);
        $('#name').html(userInfo.nickName);
    })
    
  }

  // 根据群组id获取群组信息
  function getGroupInfo(groupId, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/group/get",
      type: "get",
      data: {
        id: groupId
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          cb && cb(data.data)
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("请求失败，请稍后再试");
      }
    });
  }
})();
