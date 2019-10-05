(function() {
    FastClick.attach(document.body);
    var roomId = Util.getParam("id"),
        code = Util.getParam("code"),
        token = Util.getSession(Util.token),
        userInfo = Util.getSession(Util.baseInfo);
    // 如果token或者userInfo为空，那么是没登录，要授权登录
    if (token && userInfo) {
        init(userInfo);
    } else {
        Util.auth(code, function(token) {
            Util.getUserInfo(function(data) {
                init();
            });
        });
    }

    function init() {
        Util.Ajax({
            url: Util.openAPI + "/app/room/get",
            type: "get",
            dataType: "json",
            data: {
                id: roomId,
                useResult: false
            },
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    var data = data.data,
                        $roomMsg = $(".jr-wrapper");
                    $roomMsg.find("#roomNumber").html(data.roomNumber);
                    $roomMsg.find("#type").html(data.type);
                    $roomMsg.find("#limit").html(data.chipLimit);
                    $roomMsg.find("#numberOfGame").html(data.numberOfGame);
                    if (data.createUserId === userInfo.id) {
                        //创建者进入页面，直接跳到游戏页面
                        location.href = "./gameAnBao.html?id=" + roomId;
                    }
                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("获取房间信息失败");
            }
        });
    }
    $(".jr-btn-join").on("click", function() {
        Util.Ajax({
            url: Util.openAPI + "/app/room/joinRoom",
            type: "post",
            data: {
                id: roomId
            },
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.code === 0) {
                    location.href = "./gameAnBao.html?id=" + roomId;
                } else if (data.code === 202) {
                    location.href = "./invite.html?groupId=" + data.msg;
                } else if (data.code === 201) {
                    location.href = "./gameOver.html";

                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("请求失败，请稍后再试");
            }
        });
    });
    $(".join-close").on("click", function() {
        location.href = "./index.html?code=" + code;
    });
})();