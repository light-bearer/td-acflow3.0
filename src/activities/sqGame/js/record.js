(function() {
    FastClick.attach(document.body);
    var createScroll = null,
        joinScroll = null;
    $("#back").on("click", function() {
        history.back();
    });

    function init() {
        initScroll();
    }
    init();
    /**
     * 初始化meScroll
     */
    function initScroll() {
        var joinConfig = $.extend(
            true, {
                up: { callback: getJoinList }
            },
            Util.baseListConfig
        );
        var createConfig = $.extend(
            true, {
                up: {
                    callback: getCreateList
                }
            },
            Util.baseListConfig
        );
        joinScroll = new MeScroll("joinScroll", joinConfig);
        createScroll = new MeScroll("createScroll", createConfig);
    }

    function getCreateList(page) {
        Util.Ajax({
            url: Util.openAPI + "/app/room/getCreateList",
            type: "get",
            data: {
                limit: page.size,
                page: page.num
            },
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    var rows = data.data.rows;
                    var temp = "";
                    rows &&
                        rows.forEach(function(item) {
                            // var img = item.gameImg ? item.gameImg :"../images/record/icon_anbao.png";
                            var img = item.gameImg;
                            var textClass = +item.winIntegal < 0 ? "txt-lose" : "txt-win";
                            temp +=
                                '<li class="mc-item"><div class="mc-type-wrapper"><img src="' +
                                img +
                                '" /></div>' +
                                '<div class="r-item-det"><p>房间号：' +
                                item.roomNumber +
                                "</p><p>2019年6月8日 15:18:59</p></div>" +
                                '<div class="r-item-right"><span class="r-right-num ' +
                                textClass +
                                '">' +
                                item.winIntegal +
                                '</span><i class="icon-arrow"></i></div></li>';
                        });
                    createScroll.endBySize(rows.length, data.data.total);
                    if (page.num === 1) {
                        $(".create-records").html(temp);
                    } else {
                        $(".create-records").append(temp);
                    }
                } else {
                    Util.toast("获取战绩列表失败，请稍后重试");
                    createScroll.endErr();
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("获取战绩列表失败，请稍后重试");
                createScroll.endErr();
            }
        });
    }

    function getJoinList(page) {
        Util.Ajax({
            url: Util.openAPI + "/app/room/getJoinList",
            type: "get",
            data: {
                limit: page.size,
                page: page.num
            },
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    var rows = data.data.rows;
                    var temp = "";
                    rows &&
                        rows.forEach(function(item) {
                            // var img = "../images/record/icon_anbao.png";
                            var img = item.gameImg;
                            var textClass = +item.winIntegal < 0 ? "txt-lose" : "txt-win";
                            temp +=
                                '<li class="mc-item"><div class="mc-type-wrapper"><img src="' +
                                img +
                                '" /></div>' +
                                '<div class="r-item-det"><p>房间号：' +
                                item.roomNumber +
                                "</p><p>2019年6月8日 15:18:59</p></div>" +
                                '<div class="r-item-right"><span class="r-right-num ' +
                                textClass +
                                '">' +
                                item.winIntegal +
                                '</span><i class="icon-arrow"></i></div></li>';
                        });
                    joinScroll.endBySize(rows.length, data.data.total);
                    if (page.num === 1) {
                        $(".join-records").html(temp);
                    } else {
                        $(".join-records").append(temp);
                    }
                } else {
                    Util.toast("获取战绩列表失败，请稍后重试");
                    joinScroll.endErr();
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("获取战绩列表失败，请稍后重试");
                joinScroll.endErr();
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
    });

    $(".mc-list").on("click", ".mc-item", function(e) {
        location.href = "./recordDetail.html";
    });
})();