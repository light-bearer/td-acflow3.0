(function() {
    FastClick.attach(document.body);
    var roomNumber = Util.getParam("roomNumber");
    (function() {
        Util.Ajax({
            url: Util.openAPI + "/app/room/getResultForRoom",
            type: "get",
            dataType: "json",
            data: {
                roomNumber: roomNumber
            },
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    var data = data.data,
                        gameResultDtoList = data.gameResultDtoList,
                        time = getTime(data.createTime);
                    $('.go-txt').html('<span>房间号：' + roomNumber + '</span><span>' + time + '</span><span>' + data.numberOfGame + '局</span>')
                    var temp = '';
                    gameResultDtoList.forEach(function(item) {
                        var imgUrl = item.userImg ? item.userImg : "../images/bg_avator.png";
                        temp += '<li class="go-item"><div class="go-c-avator">' +
                            '<img src="' + imgUrl + '"></img></div>' +
                            '<div class="go-c-second"><p>' + item.userNickName + '</p> <p>ID:' + item.memberNumber + '</p></div>' +
                            '<span class="g-c-num">' + item.winIntegal + '</span></li>';
                    });
                    $('.go-list').html(temp);
                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("请求失败，请稍后重试");
            }
        });
    })();

    $('.go-btn-zj').on('click', function() {
        location.href = './record.html';
    });

    function getTime(t) {
        var time = new Date(t),
            month = time.getMonth(),
            date = time.getDate(),
            h = time.getHours(),
            m = time.getMinutes(),
            s = time.getSeconds();
        return month + '月' + date + '日 ' + h + ':' + m + ':' + s
    }

})();