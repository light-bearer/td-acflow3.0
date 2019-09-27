(function() {
    FastClick.attach(document.body);
    //1-邀请成员发出； 2-邀请加入；3加入申请
    var state = 1,
        groupId = Util.getParam('groupId'),
        code = Util.getParam("code"), // 授权code
        token = Util.getSession(Util.token),
        userInfo = Util.getSession(Util.baseInfo);
    console.log(userInfo)
        // 如果token或者userInfo为空，那么是没登录，要授权登录
    if (token && userInfo) {
        init(userInfo);
    } else {
        Util.auth(code, function(token) {
            Util.getUserInfo(function(data) {
                console.log(data)
                init(data);
            });
        });
    }
    // 设置分享数据
    setShareData(window.location.origin + window.location.pathname + '?groupId=' + groupId)
    $(".icon-close").on("click", function() {
        location.href = "./index.html";
    });
    // 绑定加入
    $('#btn_join').on('click', function(e) {
        joinGroup(groupId);
    })

    /** method */
    function init(userInfo) {
        getGroupInfo(groupId, function(data) {
            state = userInfo.id === data.createUserId ? 1 : 2;
            setPageStatus(state);
            $('#inivatee_avator').attr('src', userInfo.img);
            $('#name').html(userInfo.nickName);
        })
    }

    function setPageStatus(state) {
        $(".main-content").attr("data-state", state);
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

    // 加入群组
    function joinGroup(goupId) {
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/joinGroup?id=" + groupId,
            type: "post",
            data: {},
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.code === 0) {
                    $('#join_msg').html(data.msg);
                    setPageStatus(3);
                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("请求失败，请稍后再试");
            }
        });
    }

    // 设置分享数据
    function setShareData(shareUrl) {
        Util.wxConfig(function() {
            var shareData = {
                title: '邀请您加入管理群',
                desc: '邀请您加入管理群',
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: window.location.href.split('/html/')[0] + '/images/share.png',
                success: function() {
                    // 用户点击了分享后执行的回调函数
                }
            };
            //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃
            wx.onMenuShareTimeline(shareData);

            //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃
            wx.onMenuShareAppMessage(shareData);
            // wx.updateAppMessageShareData(shareData);
            // showDialog();
        })
    }
})();