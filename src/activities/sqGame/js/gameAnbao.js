(function() {
    FastClick.attach(document.body);
    var roomId = Util.getParam("id"),
        numberOfGame = 0,
        roomNumber, //房间号
        gameResultId = Util.getSession('gameResultId') || '', //开奖结果ID，用于下注
        hasShowResult = false, //是否已显示游戏结果
        baseInfo = Util.getSession(Util.baseInfo),
        token = Util.getSession(Util.token),
        code = Util.getParam("code"),
        gameAudio = document.getElementById('gameAudio');
    // countInterval = null;
    // var roomData; //房间数据
    // 当前座位模式
    var CURRENT_MODE = [];
    // 随机座位（除去当前登录人）
    var randomSeats;
    // 当前窗口宽度
    var WIN_WIDTH = $(window).width();
    // 当前窗口高度
    var WIN_HEIGHT = $(window).height();

    var banker = Util.getSession('banker'), //庄家的座位号
        gamer = Util.getSession('gamer'); //array 闲家的座位号
    // 位置模式, 座位，从左下角当前登录者开始，顺时针布局
    var SEAT_MODE = GameApi.SEAT_MODE;

    var throttleCountdown, throttleAudio;
    window.globalState = 1;


    /** 主要初始化 */
    (function() {
        /**
         * 微信授权
         */
        if (baseInfo && token) {
            bindEvent();
        } else {
            Util.auth(code, function(token) {
                Util.getUserInfo(function() {});
                bindEvent();
            });
        }
        // bindEvent();

    })();


    function bindEvent() {
        //页面初始化
        (function() {
            getRoomDetail({ useResult: true, random: true }, function(roomData) {
                getUserOfRoom(roomData);
                initEmptySeat(roomData);
            });



            throttleCountdown = Util.throttle(function(count, cb) {
                countDown(count, cb)
            }, 20 * 1000);
            throttleAudio = Util.throttle(function(url) {
                playAudio(encodeURIComponent(url));

            }, 10 * 1000)

            setInterval(function() {
                getRoomDetail({ useResult: true, random: false }, function(roomData) {
                    getUserOfRoom(roomData);
                });
            }, 1000);
            // //防外挂
            var antiPlug = new AntiPlug();
            antiPlug.show();
        })();

        /**
         * 获取房间的详细信息
         * @param {Boolean} params.useResult 是否需要开奖结果
         * @param {Boolean} params.random 是否获取随机座位
         */
        function getRoomDetail(params, cb) {
            GameApi.getRoomDetail({
                    id: roomId,
                    useResult: params.useResult
                },
                function(data) {
                    var data = data.data,
                        roomData = data;
                    roomNumber = data.roomNumber;
                    $roomMsg = $(".ab-room");
                    $roomMsg.find("#roomNumber").html(data.roomNumber);
                    $roomMsg
                        .find("#number")
                        .html(data.numberOfOpen + "/" + data.numberOfGame);
                    $roomMsg.find("#type").html(data.type);
                    $roomMsg.find("#odds").html(data.oddsString);
                    $roomMsg.find("#chipLimit").html(data.chipLimit);
                    numberOfGame = parseInt(data.numberOfOpen) + 1;
                    // initGame(data);
                    // 随机座位（除去当前登录人）
                    // randomSeat = getRandSeats(+data.joinUserCount - 1, +data.people - 1);
                    if (params.random) randomSeats = getRandSeats(+data.people - 1); //只在第一次进入时获取随机座位
                    cb && cb(data);
                }
            );
        }
        /**
         * 获取当前房间的状态以及人员信息
         * @param {*} roomData 房间数据
         */
        function getUserOfRoom(roomData) {
            GameApi.getUserOfRoom({
                    id: roomId,
                    numberOfGame: numberOfGame,
                    gameResultId: gameResultId
                },
                function(data) {
                    // 初始化座位
                    var result = data.data;
                    // initSeat(roomData, result);
                    gamerSeat(roomData, result);
                    initGame(roomData, result);
                    Util.setSession('gameResultId', result.gameResultId);

                    gameResultId = result.gameResultId;

                }
            );

        }
        // var throttleCountdown = Util.throttle(function(count) {
        //     countDown(count)
        // }, 10 * 1000)


        /**
         * 根据状态初始化游戏页面
         * @param {*} data
         */
        function initGame(roomData, gamersData) {
            var state = roomData.state;
            window.globalState = roomData.state;;
            $(".game-btns").attr("data-state", state);

            // var userInfo = Util.getSession(Util.baseInfo),
            var isBanker = baseInfo.id == gamersData.userIdOfRob;


            //当前参与人数少于2时，不能进行游戏
            if (+roomData.joinUserCount < 2) {
                // $(".game-btns").hide();
                $('.game-btn-action').attr('data-disable', 'true')
                return;
            }
            $('.game-btn-action').attr('data-disable', 'false');
            var gameResultList = roomData.gameResultDtoList;
            gameResultList = gameResultList.sort(function(a, b) {
                return a.numberOfGame - b.numberOfGame;
            });
            var _bankerContent = $(".game-banker-content");
            if (state != 4) {
                _bankerContent.hide();
            }

            switch (+state) {
                case 1:
                    //准备中
                    var curUser = gamersData.roomUserDtoList && gamersData.roomUserDtoList.filter(item => baseInfo.id === item.userId) || {};
                    if (curUser[0].state == 3) {
                        $(".game-btns").attr("data-state", '')

                        //开奖中
                        // var gameResultDtoList = roomData.gameResultDtoList;
                        if (
                            gameResultList &&
                            gameResultList.length > 0
                        ) {
                            //显示上一局游戏结果
                            var result = gameResultList[gameResultList.length - 1],
                                className = getResultClass(result.resultCode);
                            // $(".an-game__bottom").attr("class", "an-game__bottom  " + className);
                            $(".an-game__bottom").addClass(className);
                            $(".an-game__cover").addClass("slideOutRight");

                            //播放音效
                            playAudio('../media/process/' + result.resultCode +
                                    '.m4a')
                                // hasShowResult = true;
                                // ----- 测试赢钱 -------
                            if (banker === undefined || banker === null || banker === '') return;
                            var bankerUser = getBanker(gamersData);
                            initTrack(banker, gamer);
                            setTimeout(function() {
                                if (+bankerUser.winInteger < 0) {
                                    playAudio('../media/process/庄家派钱.mp3')
                                } else {
                                    playAudio('../media/process/庄家收钱.mp3')
                                }
                                gamer.forEach(function(g) {
                                    // 如果闲家赢了就加上earn样式，否则就remove earn样式
                                    if (+bankerUser.winInteger < 0) {
                                        $("#track" + g + "_" + banker).addClass("earn");
                                    } else {
                                        $("#track" + g + "_" + banker).removeClass("earn");

                                    }
                                });
                                $(".money-track-group").show();
                                // ------ 测试赢钱 end ------

                            }, 1000);


                            setTimeout(function() {
                                // $(".game-btns").attr("data-state", state)
                                //游戏结果效果播放完毕，修改用户状态为未准备
                                GameApi.provideFinish({
                                    roomId: roomId
                                }, function() {
                                    //状态修改完毕后重置页面部分元素状态
                                    $('.seat').removeClass('banker');
                                    $(".money-track-group").hide();
                                    $(".an-game__cover").removeClass("slideOutRight");
                                });
                            }, 4000);
                        }
                    } else {
                        $('.seat').removeClass('banker');
                        $('.chip[data-type="move"]').remove();
                        $(".game-btns").attr("data-state", state);
                        $('.chip-group').hide();
                        totalChip = 0;
                        $(".an-game__cover").removeClass("slideOutRight");
                        $(".an-game__bottom").attr("class", "an-game__bottom ");

                    }

                    break;
                case 2:
                    //抢庄中
                    // countDown(10, function() {
                    //     state == 2 && rob(0, true); //倒计时结束，状态未改变时自动提交
                    // });
                    throttleCountdown(10, function() {
                        console.info('window--111--', window.globalState)
                            //使用全部变量，避开闭包
                        window.globalState === 2 && rob(0, true); //倒计时结束，状态未改变时自动提交

                    });
                    break;
                case 3:
                    // 抢庄完成：这里要调用动态效果，轮询定庄，定完庄后，调用接口修改房间状态；
                    throttleAudio('../media/process/叮.mp3');
                    creatBankerTrack();
                    GameApi.updateState(roomId, function() {
                        setTimeout(function() {
                            $('.money-track-group').hide();
                        }, 500);
                    });
                    break;
                case 4:
                    //定宝
                    $('.game-btn-db').attr('data-isbanker', isBanker);
                    if (isBanker) {
                        console.info('show game-banker-content  ', state, isBanker)
                        _bankerContent.show();
                    } else {
                        _bankerContent.hide();
                        // $(".game-btn-db").hide();
                    }
                    // countDown(20, function() {
                    //     if (isBanker) {
                    //         state == 4 && db();
                    //     }
                    // });
                    // throttleAudio('../media/process/庄家定宝.m4a');

                    throttleCountdown(20, function() {
                        if (isBanker) {
                            window.globalState === 4 && db();
                        }
                    });
                    break;
                case 5:
                    //下注中
                    $("#betBtnWrapper").attr("data-isbanker", isBanker);
                    if (!isBanker) {
                        $(".chip-group").show();
                        // countDown(15, function() {
                        //     state == 5 && stopBet(true);
                        //     $(".chip-group").hide();
                        //     $(".game-btn-stop").hide();
                        // });

                        throttleCountdown(15, function() {
                            window.globalState === 5 && stopBet(true);
                            $(".chip-group").hide();
                            $(".game-btn-stop").hide();
                        });
                    } else {
                        $(".game-count-down").hide();
                    }
                    var gameBetList = gamersData.gameBetList;

                    setTimeout(function() {
                        initBetData(gameBetList);
                    }, 0);
                    break;
                case 6:
                    //开宝中
                    if (isBanker) {
                        $(".game-btns").addClass("banker");
                        // countDown(10, function() {
                        //     state == 6 && bankerOpen();
                        // });
                        throttleCountdown(10, function() {
                            window.globalState === 6 && bankerOpen();
                        });
                    } else {
                        $(".game-btns").removeClass("banker");
                    }
                    var gameBetList = gamersData.gameBetList;
                    setTimeout(function() {
                        initBetData(gameBetList);
                    }, 0);
                    break;
                case 10:
                    //游戏已完成
                    location.href = "./gameOver.html?roomNumber=" + roomNumber;
                    break;


            }
            // var gameResultList = roomData.gameResultDtoList,
            var firstRowTemp = '',
                secondRowTemp = '',
                resultWrappers = $('.result-wrapper');
            if (gameResultList && gameResultList.length > 0) {
                gameResultList && gameResultList.forEach(function(item, index) {
                    var className = getResultClass(item.resultCode),
                        _resultIcon = $('#result' + item.id);
                    if (!_resultIcon || _resultIcon.length === 0) {
                        temp = '<i id="result' + item.id + '" class="icon-result ' + className + '"></i>'
                        if (index < 5) {
                            firstRowTemp += temp;
                        } else {
                            secondRowTemp += temp;
                        }
                    }

                });
                resultWrappers.eq(0).append(firstRowTemp);
                resultWrappers.eq(1).append(secondRowTemp);
            }
        }

        function getBanker(data) {
            var roomUsers = data.roomUserDtoList;
            var banker = {};
            roomUsers && roomUsers.forEach(function(item) {
                if (item.userId === data.userIdOfRob) {
                    banker = item;
                }
            });
            return banker;
        }

        function getResultClass(code) {
            var className = "";
            switch (code) {
                case "龙":
                    className = "long";
                    break;
                case "虎":
                    className = "hu";
                    break;
                case "出":
                    className = "chu";
                    break;
                case "入":
                    className = "ru";
                    break;
            }
            return className;
        }

        function initBetData(gameBetList) {
            // console.info('---initBetData-', gameBetList)
            gameBetList &&
                gameBetList.forEach(function(item) {
                    // console.info(baseInfo.id, item.userId);
                    // if (baseInfo.id != item.userId) {
                    //     // console.info(item.userId, $("#" + item.userId), $("#3"));
                    //     var seatIndex = $("#" + item.userId).attr("data-index");
                    //     // console.info(item.userId, seatIndex);
                    //     bets(seatIndex, item.betMoney, { x: item.x, y: item.y });
                    // }
                    var seatIndex = $("#" + item.userId).attr("data-index");
                    bets(seatIndex, item.betMoney, item.id, { x: item.x, y: item.y });
                });
        }



        function countDown(count, cb) {
            // console.info('countdown--', count)
            $(".game-count-down").html(count);
            var countInterval = setInterval(function() {
                if (count == 1) {
                    cb && cb();
                    clearInterval(countInterval);
                }
                if (window.globalState === 4 && count <= 9) {
                    //庄家定宝：庄、闲家都调用庄家定宝.m4a，倒计时如果达到8秒，每1秒都调用一次定宝倒计时.m4a；
                    playAudio('../media/process/定宝倒计时.mp3')

                }
                count--;
                $(".game-count-down").html(count);
            }, 1000);
        }

        // 位置
        // var $seats = $(".seat");
        // 根据庄家的位置，和参与者的位置，初始化金币轨道（每局游戏抢庄结束后都要重新初始化）
        // var banker = 29,
        //   gamer = [8, 9, 20];
        // initTrack(banker, gamer);
        // ----- 测试赢钱 -------
        // gamer.forEach(function(g) {
        //   // 如果赢了就加上earn样式，否则就remove earn样式
        //   $("#track" + g + "_" + banker).addClass("earn");
        // });
        // $(".money-track-group").show();
        // ------ 测试赢钱 end ------

        var totalChip = 0;
        // gameCode = []; //下注的游戏码

        // 点击下注盘
        $(".an-game-content").on("click", ".item", function(e) {
            var $target = $(e.currentTarget),
                type = $target.attr("data-type"),
                id = $target.attr("id");
            value = $target.attr("data-value");
            console.log(type + ": " + value);

            // 必须是有效区域才能下注
            if (type === "code") {
                // 当前筹码
                var chip = $(".chip.active").attr("data-value");
                // 当前登录人下注
                if (chip) {
                    // chip = +chip;
                    var _total = totalChip + parseInt(chip);
                    // debugger

                    if (_total <= 100) {
                        totalChip += parseInt(chip);

                        // gameCode.push(value);
                        var x = e.clientX - 10,
                            y = e.clientY - 12;
                        bets(0, chip, null, { x: x, y: y });
                        //播放下注音频
                        playAudio('../media/process/下注.mp3');
                        toBet({ chip: chip, x: x, y: y, code: value });
                        $(".game-btn-chips").html(totalChip);
                    } else {
                        Util.toast("剩余筹码不足");
                    }
                } else {
                    Util.toast("请选择筹码");
                }
            }
        });
        // 点击筹码
        $(".chip-group").on("click", ".chip", function(e) {
            var $target = $(e.currentTarget),
                chip = $target.attr("data-value");
            $(".chip").removeClass("active");
            $target.addClass("active");
        });

        $(".game-btn-action").on("click", function() {
            var type = $(this).attr("data-type"),
                btnDisable = $(this).attr('data-disable');
            if (btnDisable === 'true') {
                Util.toast('玩家不足');
                return;
            }
            switch (type) {
                case "ready":
                    //准备
                    ready();
                    $('#' + baseInfo.id).find('figure').addClass('ready');
                    break;
                case "rob":
                    //抢庄
                    gameAudio.src = '../media/process/抢.m4a';
                    gameAudio.play();
                    rob(1, false);
                    // $('#' + baseInfo.id).addClass('rob');
                    break;
                case "norob":
                    //不抢庄
                    rob(2, false);
                    gameAudio.src = '../media/process/不抢.m4a';
                    gameAudio.play();
                    // $('#' + baseInfo.id).addClass('norob');

                    break;
                case "db":
                    //庄家定宝
                    throttleAudio('../media/process/庄家定宝.m4a');
                    db();
                    break;
                case "stop":
                    //停止下注
                    stopBet(false);
                    break;
                case "betStatis":
                    //下注统计
                    GameApi.getStatResultOfBet({ gameResultId: gameResultId });
                    break;
                case "kb":
                    //开宝
                    playAudio('../media/process/开宝.m4a');
                    setTimeout(function() {
                        playAudio('../media/process/开宝完成.mp3');
                    }, 2000)
                    bankerOpen();
                    break;
            }
        });
        //庄家定宝
        $(".gb-item").on("click", function() {
            var _target = $(this),
                _bankerContent = $(".game-banker-content"),
                type = _target.attr("data-type"),
                classStr = "game-banker-content " + type;
            // $(".gb-item").removeClass("active");
            // _target.addClass("active");

            _bankerContent.attr("class", classStr).attr("data-select", type);
            _bankerContent.find(".an-game__cover").addClass("slideOutRight");
        });
        /**
         * 停止下注
         * @param {Boolean} isAutoStop 是否倒计时结束自动调的接口
         */
        function stopBet(isAutoStop) {
            $('.chip-group').hide();
            $('.chip-group').find('.chip').removeClass('active');
            GameApi.stopBet({ roomId: roomId, isAutoStop: isAutoStop });
        }
        /**
         * 准备
         */
        function ready() {
            Util.Ajax({
                url: Util.openAPI + "/app/roomUser/ready",
                type: "post",
                dataType: "json",
                data: {
                    roomId: roomId,
                    numberOfGame: numberOfGame
                },
                cbOk: function(data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.code === 0) {

                    } else {
                        Util.toast(data.msg);
                    }
                },
                cbErr: function(e, xhr, type) {
                    Util.toast("操作失败，请稍后重试");
                }
            });
        }
        /**
         * 抢庄
         * @param {int} isRob 是否抢庄：0未操作、1抢庄、2不抢 ,
         */
        function rob(isRob, isAutoRob) {
            Util.Ajax({
                url: Util.openAPI + "/app/roomUser/rob",
                type: "post",
                dataType: "json",
                data: {
                    roomId: roomId,
                    isRob: isRob,
                    numberOfGame: numberOfGame,
                    isAutoRob: isAutoRob
                },
                cbOk: function(data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.code === 0) {} else {
                        Util.toast(data.msg);
                    }
                },
                cbErr: function(e, xhr, type) {
                    Util.toast("操作失败，请稍后重试");
                }
            });
        }
        /**
         * 庄家定宝
         */
        function db() {
            var selectCode = $(".game-banker-content").attr("data-select"),
                resultCode = "龙";
            if (selectCode == "hu") {
                resultCode = "虎";
            }
            if (selectCode == "chu") {
                resultCode = "出";
            }
            if (selectCode == "ru") {
                resultCode = "入";
            }
            if (selectCode == "long") {
                resultCode = "龙";
            }

            GameApi.setResultCode({
                roomId: roomId,
                numberOfGame: numberOfGame,
                resultCode: resultCode
            }, function() {
                $('.game-banker-content').hide();
                $('.game-banker-content').attr('class', 'game-banker-content').attr('data-select', '');
            });
        }
        /**
         * 下注
         */
        function toBet(params) {
            GameApi.bet({
                roomId: roomId,
                numberOfGame: numberOfGame,
                code: params.code,
                betMoney: params.chip,
                gameResultId: gameResultId,
                x: params.x,
                y: params.y
            });
        }
        /**
         * 开宝
         */
        function bankerOpen() {
            GameApi.open({
                gameResultId: gameResultId,
                id: roomId
            });
        }

        // /**
        //  * @desc 获取宽度或者高度百分比
        //  * @param {number} num 数值
        //  * @param {string} type: w-宽度；h-高度
        //  */
        // function getPercent(num, type) {
        //   var _num = type === "w" ? 750 : 1206;
        //   _device = type === "w" ? WIN_WIDTH : WIN_HEIGHT;
        //   return ((num / _num) * _device).toFixed(0) + "px";
        // }
        /**
         *初始化空位置
         * @param {*} roomData 
         */
        function initEmptySeat(roomData) {
            var totalCount = roomData.people;
            var totalCount = roomData.people;
            // 如果人多，样式修改
            if (totalCount >= 20) {
                $(".ab-txt").addClass("small");
                $(".ab-room").addClass("more");
            }
            if (totalCount >= 30) {
                $(".an-game-content").addClass("lower");
            }

            // 获取当前位置模式，即位置数据
            CURRENT_MODE = SEAT_MODE["MODE" + totalCount];
            var temp = '';
            if (CURRENT_MODE) {
                for (var i = 0, len = CURRENT_MODE.length; i < len; i++) {
                    temp += '<div class="seat empty ' +
                        (CURRENT_MODE[i].class || "") +
                        '" data-index="' + i + '" style="top:' +
                        CURRENT_MODE[i].top +
                        "; left:" +
                        CURRENT_MODE[i].left +
                        "; right: " +
                        CURRENT_MODE[i].right +
                        '"></div>';
                }
                $(".gamer-group")
                    .addClass("mode" + totalCount)
                    .html(temp);

            }
        }
        /**
         * 玩家入座
         * @param {*} roomData 
         * @param {*} roomUsersData 
         */
        function gamerSeat(roomData, roomUsersData) {
            var list = roomUsersData.roomUserDtoList,
                curUser = {}, //当前用户
                gamerList = []; //除掉当前用户的其他玩家
            banker = null; //庄家的座位号
            gamer = []; //闲家的座位号
            list.forEach(function(item) {
                if (item.userId == baseInfo.id) {
                    curUser = item;
                } else {
                    gamerList.push(item);
                }
            });
            if (curUser && curUser.id) {
                var curUserStatus = getGamerStatus(
                    curUser,
                    roomData.state,
                    roomUsersData.userIdOfRob
                );
                if (curUserStatus.isBanker) {
                    banker = 0;
                } else {
                    gamer.push(0);
                }
                // console.info('test---', curUserStatus.robClass)
                var curUserClass = "seat current-user " + curUserStatus.robClass + " " + curUserStatus.bankerClass,
                    $curUserSeat = $('#' + curUser.id);
                // console.info('$curUserSeat----', $curUserSeat)
                if ($curUserSeat && $curUserSeat.length > 0) {
                    $curUserSeat.attr('class', curUserClass);
                    $curUserSeat.find('figure').attr('class', curUserStatus.readyClass);
                    $curUserSeat.find('.score').html(curUser.sumWinInteger)
                } else {
                    var temp = "<figure class='" +
                        curUserStatus.readyClass +
                        "'>" +
                        '<img src="' +
                        curUserStatus.userImg +
                        '"/>' +
                        "<figcaption>" +
                        curUser.userNickName +
                        "</figcaption>" +
                        "</figure>" +
                        '<div class="score">' +
                        curUser.sumWinInteger +
                        "</div>" +
                        '<span class="member-no">' +
                        curUser.memberNumber +
                        "</span>";
                    $('.seat[data-index="0"]').attr('id', curUser.userId).attr('class', curUserClass).html(temp);
                }

            }

            var useRandomSeats = randomSeats.slice(0, gamerList.length);
            useRandomSeats.forEach(function(seatNo) {
                var mode_item = CURRENT_MODE[seatNo],
                    gamerData = gamerList.pop(),
                    gamerStatus = getGamerStatus(
                        gamerData,
                        roomData.state,
                        roomUsersData.userIdOfRob
                    );
                if (gamerStatus.isBanker) {
                    banker = seatNo;
                } else {
                    gamer.push(seatNo);
                }
                var $seat = $('#' + gamerData.userId),
                    seatClass = "seat gamer " + gamerStatus.robClass + " " + gamerStatus.bankerClass + (mode_item.class || "");
                if ($seat && $seat.length > 0) {
                    //玩家已有座位
                    $seat.attr('class', seatClass);
                    $seat.find('figure').attr('class', gamerStatus.readyClass);
                    $seat.find('.score').html(gamerData.sumWinInteger)

                } else {
                    //玩家还未入座
                    var $emptySeat = $('.seat[data-index="' + seatNo + '"]');
                    // seatClass = "seat gamer " + gamerStatus.robClass + " " + gamerStatus.bankerClass + (mode_item.class || ""),
                    seatTemp = "<figure class='" +
                        gamerStatus.readyClass +
                        "'>" +
                        '<img src="' +
                        gamerStatus.userImg +
                        '"/>' +
                        "<figcaption>" +
                        gamerData.userNickName +
                        "</figcaption>" +
                        "</figure>" +
                        '<div class="score">' +
                        gamerData.sumWinInteger +
                        "</div>";
                    $emptySeat.attr('id', gamerData.userId).attr('class', seatClass).html(seatTemp);
                }


            });
            // if (roomData.state == 3) {
            //     // 抢庄完成：这里要调用动态效果，轮询定庄，定完庄后，调用接口修改房间状态；
            //     creatBankerTrack();
            //     GameApi.updateState(roomId);
            // }

            Util.setSession('banker', banker + '');
            Util.setSession('gamer', gamer);

        }

        // /**
        //  * 座位初始化
        //  * @param {string} totalCount 总人数
        //  * @param {*} roomUsersData 房间内玩家信息
        //  */
        // function initSeat(roomData, roomUsersData) {
        //     var list = roomUsersData.roomUserDtoList;
        //     var totalCount = roomData.people;
        //     // 如果人多，样式修改
        //     if (totalCount >= 20) {
        //         $(".ab-txt").addClass("small");
        //         $(".ab-room").addClass("more");
        //     }
        //     if (totalCount >= 30) {
        //         $(".an-game-content").addClass("lower");
        //     }

        //     // 获取当前位置模式，即位置数据
        //     CURRENT_MODE = SEAT_MODE["MODE" + totalCount];
        //     banker = null; //庄家的座位号
        //     gamer = []; //闲家的座位号
        //     if (CURRENT_MODE) {
        //         // var baseInfo = Util.getSession("BASE_INFO"),
        //         var curUser = {},
        //             gamerList = [];
        //         list.forEach(function(item) {
        //             if (item.userId == baseInfo.id) {
        //                 curUser = item;
        //             } else {
        //                 gamerList.push(item);
        //             }
        //         });

        //         var curUserStatus = getGamerStatus(
        //             curUser,
        //             roomData.state,
        //             roomUsersData.userIdOfRob
        //         );
        //         if (curUserStatus.isBanker) {
        //             banker = 0;
        //         } else {
        //             gamer.push(0);
        //         }

        //         // 当前用户模版
        //         var _temp = '';
        //         if (curUser && curUser.userNickName) {
        //             _temp +=
        //                 '<div id="seat' +
        //                 curUser.userId +
        //                 '" class="seat current-user ' +
        //                 curUserStatus.robClass +
        //                 " " +
        //                 curUserStatus.bankerClass +
        //                 '"  style="top:' +
        //                 CURRENT_MODE[0].top +
        //                 "; left:" +
        //                 CURRENT_MODE[0].left +
        //                 "; right: " +
        //                 CURRENT_MODE[0].right +
        //                 '" data-index="0">' +
        //                 "<figure class='" +
        //                 curUserStatus.readyClass +
        //                 "'>" +
        //                 '<img src="' +
        //                 curUserStatus.userImg +
        //                 '"/>' +
        //                 "<figcaption>" +
        //                 curUser.userNickName +
        //                 "</figcaption>" +
        //                 "</figure>" +
        //                 '<div class="score">' +
        //                 curUser.sumWinInteger +
        //                 "</div>" +
        //                 '<span class="member-no">' +
        //                 curUser.memberNumber +
        //                 "</span>" +
        //                 "</div>";
        //         } else {
        //             _temp +=
        //                 '<div id="seat0"  class="seat empty ' +
        //                 (CURRENT_MODE[0].class || "") +
        //                 '" data-index="0" style="top:' +
        //                 CURRENT_MODE[0].top +
        //                 "; left:" +
        //                 CURRENT_MODE[0].left +
        //                 "; right: " +
        //                 CURRENT_MODE[0].right +
        //                 '"></div>';


        //         }


        //         var useRandomSeats = randomSeats.slice(0, gamerList.length);

        //         for (var i = 1, len = CURRENT_MODE.length; i < len; i++) {
        //             // 如果有人就编辑玩家模版，如果没有就编译空位置模版
        //             var mode_item = CURRENT_MODE[i];
        //             if (useRandomSeats.indexOf(i) != -1) {
        //                 var gamerData = gamerList.pop();
        //                 var gamerStatus = getGamerStatus(
        //                     gamerData,
        //                     roomData.state,
        //                     roomUsersData.userIdOfRob
        //                 );
        //                 if (gamerStatus.isBanker) {
        //                     banker = i;
        //                 } else {
        //                     gamer.push(i);
        //                 }

        //                 _temp +=
        //                     ' <div id="seat' +
        //                     gamerData.userId +
        //                     '" class="seat gamer ' +
        //                     gamerStatus.robClass +
        //                     " " +
        //                     gamerStatus.bankerClass +
        //                     (mode_item.class || "") +
        //                     '"  style="top:' +
        //                     mode_item.top +
        //                     "; left:" +
        //                     mode_item.left +
        //                     "; right: " +
        //                     mode_item.right +
        //                     '" data-index="' +
        //                     i +
        //                     '">' +
        //                     "<figure class='" +
        //                     gamerStatus.readyClass +
        //                     "'>" +
        //                     '<img src="' +
        //                     gamerStatus.userImg +
        //                     '"/>' +
        //                     "<figcaption>" +
        //                     gamerData.userNickName +
        //                     "</figcaption>" +
        //                     "</figure>" +
        //                     '<div class="score">' +
        //                     gamerData.sumWinInteger +
        //                     "</div>" +
        //                     "</div>";
        //             } else {
        //                 _temp +=
        //                     '<div id="seat' +
        //                     i +
        //                     '"  class="seat empty ' +
        //                     (mode_item.class || "") +
        //                     '" data-index="' +
        //                     i +
        //                     '" style="top:' +
        //                     mode_item.top +
        //                     "; left:" +
        //                     mode_item.left +
        //                     "; right: " +
        //                     mode_item.right +
        //                     '"></div>';
        //             }
        //         }
        //     }

        //     $(".gamer-group")
        //         .addClass("mode" + totalCount)
        //         .html(_temp);
        //     if (roomData.state == 3) {
        //         // 抢庄完成：这里要调用动态效果，轮询定庄，定完庄后，调用接口修改房间状态；
        //         creatBankerTrack();
        //         GameApi.updateState(roomId);
        //     }

        //     Util.setSession('banker', banker + '');
        //     Util.setSession('gamer', gamer);
        //     // ----- 测试赢钱 -------
        //     // initTrack(banker, gamer);
        //     // // if (!banker) return;

        //     // gamer.forEach(function(g) {
        //     //   // 如果赢了就加上earn样式，否则就remove earn样式
        //     //   $("#track" + g + "_" + banker).addClass("earn");
        //     // });
        //     // $(".money-track-group").show();
        //     // ------ 测试赢钱 end ------
        // }

        function getGamerStatus(data, state, userIdOfRob) {
            var result = {
                userImg: data.userImg ? data.userImg : "../images/bg_avator.png",
                robClass: "",
                bankerClass: "",
                readyClass: "",
                isBanker: false
            };
            if (state == 2) {
                //state (integer): 游戏状态：1准备中、2抢庄中、3抢庄完成、4定宝中、5下注中、6开奖中
                //isRob (integer): 是否抢庄：0未操作、1抢庄、2不抢
                // result.robClass = data.isRob == 1 ? "rob" : "norob";

                if (data.isRob == 1) {
                    result.robClass = 'rob';
                }
                if (data.isRob == 2) {
                    result.robClass = 'norob';
                }
            }
            if (data.userId && userIdOfRob && data.userId == userIdOfRob) {
                result.bankerClass = "banker";
                result.isBanker = true;
            }
            if (state == 1 && data.state == 1) {
                //state (integer): 状态：0未准备、1已准备、2下注完成
                result.readyClass = "ready";
            }
            return result;
        }
        /**
         * 随机选取座位
         * @param {number} count - 选取的座位数
         * @param {number} total - 总的座位数量
         */
        function getRandSeats(total) {
            var arr = [];
            for (var i = 1; i < total; i++) {
                arr.push(i);
            }
            var randomSeats = arr.sort(function() {
                return Math.random() - 0.5;
            });
            return randomSeats;
            // count = 1;
            // if (count > total) return;
            // var arr = [];
            // for (var i = 1; i <= total; i++) {
            //   arr.push(i);
            // }
            // var randomSeats = arr
            //   .sort(function() {
            //     return Math.random() - 0.5;
            //   })
            //   .slice(0, count);
            // return randomSeats;
        }
        /**
         *
         * @param {number} sin - 正弦值
         */
        function getSinDeg(sin) {
            var result = Math.asin(sin) / (Math.PI / 180);
            // result = Math.round(result);
            return result.toFixed(2);
        }
        /**
         * 赢钱和输钱（输钱顺放动画，赢钱倒放动画）
         * @param {number} seatStart - 开始座位下标，从0开始
         * @param {number} seatEnd - 结束座位下标，从0开始
         */
        function createTrack(seatStart, seatEnd) {
            var $seats = $(".seat");
            var start = $($seats[seatStart]).offset(),
                end = $($seats[seatEnd]).offset();
            if (!start || !end) return;
            var trackHeight = Math.sqrt(
                Math.pow(start.left - end.left, 2) + Math.pow(start.top - end.top, 2)
            );
            var deg = getSinDeg((end.top - start.top) / trackHeight);

            deg = start.left - end.left > 0 ? 90 - deg : deg - 90;
            var coins =
                '<i class="coins"></i><i class="coins1"></i><i class="coins2"></i>';
            var $track = $("<div/>")
                .addClass("money-track")
                .attr("id", "track" + seatStart + "_" + seatEnd)
                .css({
                    height: trackHeight + "px",
                    top: start.top + 10 + "px",
                    left: start.left + 2 + "px",
                    "-webkit-transform": "rotate(" + deg + "deg)",
                    "-ms-transform": "rotate(" + deg + "deg)",
                    transform: "rotate(" + deg + "deg)"
                })
                .html(coins);
            $(".money-track-group").append($track);
        }
        //抢庄特效
        function creatBankerTrack() {
            var start = $(".an-game__cover").offset(),
                // end = $(".banker").offset();
                end = $("#" + baseInfo.id).offset();
            if (!start || !end) return;
            var trackHeight = Math.sqrt(
                Math.pow(start.left - end.left, 2) + Math.pow(start.top - end.top, 2)
            );
            var deg = getSinDeg((end.top - start.top) / trackHeight);
            deg = start.left - end.left > 0 ? 90 - deg : deg - 90;
            var bankerIcon = $("<i/>")
                .addClass("icon-banker")
                .css({
                    "-webkit-transform": "rotate(-" + deg + "deg)",
                    "-ms-transform": "rotate(-" + deg + "deg)",
                    transform: "rotate(-" + deg + "deg)"
                });
            var $track = $("<div/>")
                .addClass("money-track")
                .css({
                    height: trackHeight + "px",
                    top: start.top + 10 + "px",
                    left: start.left + 2 + "px",
                    "-webkit-transform": "rotate(" + deg + "deg)",
                    "-ms-transform": "rotate(" + deg + "deg)",
                    transform: "rotate(" + deg + "deg)"
                })
                .html(bankerIcon);
            $(".money-track-group").append($track);
            $(".money-track-group").show();
        }
        /**
         *
         * @param {number} banker - 庄家的座位号
         * @param {array} gamers - 游戏者的座位号数组
         */
        function initTrack(banker, gamers) {
            // 清空轨道
            $(".money-track-group").html("");
            gamers.forEach(function(g) {
                createTrack(g, banker);
            });
        }
        /**
         * 根据座位，获取下注吗的起始位置
         * @param {string}seatIndex 座位号，从0开始
         */
        function getStartPos(seatIndex) {
            var seat = CURRENT_MODE[seatIndex];
            if (!seat) return;
            if (seat.left === "initial") {
                var x =
                    WIN_WIDTH -
                    parseInt(seat.right.replace("px", "")) -
                    $("#seat" + seatIndex).width() +
                    5;
            } else {
                var x = parseInt(seat.left.replace("px", ""));
            }
            var y = parseInt(seat.top.replace("px", "")) + 15;
            return [x, y];
        }
        /**
         * 根据下注id，获取下注吗的最终位置
         * @param {string}targetId 目标id
         */
        function getEndPos(targetId) {
            var $target = $("#" + targetId);
            var x = $target.offset().left + 10,
                y = $target.offset().top + 5;
            switch (targetId) {
                case "item9":
                case "item14":
                case "item19":
                    x -= 5;
                    break;
                case "item13":
                    x += 15;
                    break;
                case "item16":
                case "item17":
                case "item18":
                    y += 30;
                    break;
                case "item25":
                case "item26":
                case "item27":
                case "item28":
                    x += 30;
                    y += 35;
            }
            return [x, y];
        }
        /**
         * 下注
         * @param {number} seatIndex 座位号，从0开始
         * @param {number} chip 筹码值 可选10, 20, 30, 50, 100
         * @param {object} endPos, 结束坐标
         * @param {number} endPos.x, 结束坐标 x
         * @param {number} endPos.y, 结束坐标 y
         */
        function bets(seatIndex, chip, id, endPos) {
            // 动画时间
            var dura = 300;
            // 起始坐标
            var start = getStartPos(seatIndex);
            if (!start) return;
            // 结束坐标
            // var end = getEndPos(targetId);
            var end = [endPos.x, endPos.y];
            // 初始化下注码
            // if ($chip.length <= 0) {
            if (id) {
                var _chip = $('.chip[data-id="' + id + '"]');
                if (_chip && _chip.length > 0) return; //防止重复渲染导致动画重复播放
            }

            var $chip = $("<div/>")
                .attr('data-id', id)
                .attr('data-type', 'move')
                // .attr('id', 'chip_move' + seatIndex)
                .addClass("chip")
                .addClass("move")
                .addClass("chip-move" + seatIndex)
                .addClass("transition")
                .css({ top: start[1] + "px", left: start[0] + "px" });
            $(".main-content").append($chip);
            // }
            $chip.addClass("chip" + chip);

            // 下注码的目标位置
            setTimeout(function() {
                $chip.css({
                    "-webkit-transform": "translate(" +
                        (end[0] - start[0]) +
                        "px, " +
                        (end[1] - start[1]) +
                        "px)",
                    "-ms-transform": "translate(" +
                        (end[0] - start[0]) +
                        "px, " +
                        (end[1] - start[1]) +
                        "px)",
                    transform: "translate(" +
                        (end[0] - start[0]) +
                        "px, " +
                        (end[1] - start[1]) +
                        "px)"
                });
            }, 0);

            // setTimeout(function(e) {
            //   $chip.remove();
            // }, 300);


        }

        $(".game-msg").on("click", function() {
            $(".msg-popup").show();
        });
        $(".msg-masker").on("click", function() {
            $(".msg-popup").hide();
        });
        $(".msg-list").on("click", "li", function() {
            var _target = $(this),
                name = _target.attr("data-name");
            $(".msg-masker").trigger("click");
            gameAudio.src = "../media/talk/" + name + '.m4a';
            gameAudio.play();

        });



        // 设置分享数据
        setShareData(
            window.location.href.split("/html/")[0] + "/html/joinRoom.html?id=" + roomId
        );

        // 设置分享数据
        function setShareData(shareUrl) {
            // console.info('1233---', shareUrl);
            Util.wxConfig(function(resp) {
                var shareData = {
                    title: "暗宝游戏",
                    desc: "暗宝游戏",
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: window.location.href.split("/html/")[0] + "/images/share.png",
                    success: function() {
                        // 用户点击了分享后执行的回调函数
                    }
                };
                // alert('onMenuShareTimeline link:' + shareData.link)
                //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃
                wx.onMenuShareTimeline(shareData);

                //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃
                wx.onMenuShareAppMessage(shareData);
                // wx.updateAppMessageShareData(shareData);
                // showDialog();
            });
        }

        function playAudio(url) {
            url = decodeURIComponent(url);
            if (wx) {
                wx.getNetworkType({
                    complete: function(resp) {
                        gameAudio.src = url;
                        gameAudio.play().catch(function() {});
                    }
                })
            } else {
                gameAudio.src = url;
                gameAudio.play().catch(function() {});
            }

        }
    }
})();