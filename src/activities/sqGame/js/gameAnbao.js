(function() {
  FastClick.attach(document.body);
  var roomId = Util.getParam("id"),
    numberOfGame = 0,
    gameResultId, //开奖结果ID，用于下注
    hasShowResult = false, //是否已显示游戏结果
    baseInfo = Util.getSession("BASE_INFO");
  // var roomData; //房间数据
  // 当前座位模式
  var CURRENT_MODE = [];
  // 随机座位（除去当前登录人）
  var randomSeats;
  // 当前窗口宽度
  var WIN_WIDTH = $(window).width();
  // 当前窗口高度
  var WIN_HEIGHT = $(window).height();

  var banker, //庄家的座位号
    gamer; //array 闲家的座位号
  // 位置模式, 座位，从左下角当前登录者开始，顺时针布局
  var SEAT_MODE = GameApi.SEAT_MODE;

  //页面初始化
  (function() {
    getRoomDetail({ useResult: true, random: true }, function(roomData) {
      getUserOfRoom(roomData);
    });

    // invertal = setInterval(function() {
    //   getRoomDetail({useResult: true, random: false}, function(roomData) {
    //     getUserOfRoom(roomData);
    //   });
    // }, 3000);
    //防外挂
    // var antiPlug = new AntiPlug();
    // antiPlug.show();
  })();

  /**
   * 获取房间的详细信息
   * @param {Boolean} params.useResult 是否需要开奖结果
   * @param {Boolean} params.random 是否获取随机座位
   */
  function getRoomDetail(params, cb) {
    GameApi.getRoomDetail(
      {
        id: roomId,
        useResult: params.useResult
      },
      function(data) {
        var data = data.data,
          roomData = data;
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
    GameApi.getUserOfRoom(
      {
        id: roomId,
        numberOfGame: numberOfGame
      },
      function(data) {
        // 初始化座位
        var result = data.data;
        initSeat(roomData, result);
        initGame(roomData, result);

        gameResultId = result.gameResultId;
      }
    );
    // Util.Ajax({
    //   url: Util.openAPI + "/app/roomUser/getUserOfRoom",
    //   type: "get",
    //   dataType: "json",
    //   data: {
    //     id: roomId,
    //     numberOfGame: numberOfGame
    //   },
    //   cbOk: function(data, textStatus, jqXHR) {
    //     // console.log(data);
    //     if (data.code === 0) {
    //       // 初始化座位
    //       initGame(roomData, data.data);
    //       initSeat(roomData, data.data);
    //     } else {
    //       Util.toast(data.msg);
    //     }
    //   },
    //   cbErr: function(e, xhr, type) {
    //     Util.toast("获取房间状态信息失败");
    //   }
    // });
  }
  /**
   * 根据状态初始化游戏页面
   * @param {*} data
   */
  function initGame(roomData, gamersData) {
    //当前参与人数少于2时，不能进行游戏
    if (+roomData.joinUserCount < 2) {
      $(".game-btns").hide();
      return;
    }
    var state = roomData.state;
    state != 1 && $(".game-btns").attr("data-state", state);
    var userInfo = Util.getSession(Util.baseInfo),
      isBanker = userInfo.id == gamersData.userIdOfRob;
    switch (state) {
      case 2:
        //抢庄中
        countDown(10, function() {
          state == 2 && rob(0, true); //倒计时结束，状态未改变时自动提交
        });
        break;
      case 3:
        // 抢庄完成：这里要调用动态效果，轮询定庄，定完庄后，调用接口修改房间状态；
        // creatBankerTrack();
        // GameApi.updateState(roomId);
        break;
      case 4:
        var _bankerContent = $(".game-banker-content");
        if (isBanker) {
          _bankerContent.show();
        } else {
          $(".game-btn-kb").hide();
        }
        //定宝
        countDown(20, function() {
          if (isBanker) {
            state == 4 && db();
          }
        });
        break;
      case 5:
        //下注中
        $("#betBtnWrapper").attr("data-isbanker", isBanker);
        if (!isBanker) {
          $(".chip-group").show();
          countDown(15, function() {
            state == 5 && stopBet(true);
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
          countDown(10, function() {
            state == 6 && bankerOpen();
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
        location.href="./gameOver.html";
        break;
      default:
        //准备中
        var gameResultDtoList = roomData.gameResultDtoList;
        if (
          !hasShowResult &&
          gameResultDtoList &&
          gameResultDtoList.length > 0
        ) {
          //显示上一局游戏结果
          var result = gameResultDtoList[gameResultDtoList.length - 1],
            className = getResultClass(result.resultCode);
          $(".an-game__bottom").attr("class", "an-game__bottom  " + className);
          $(".an-game__cover")
            .removeClass("slideOutRight")
            .addClass("slideOutRight");
          hasShowResult = true;
          setTimeout(function() {
            $(".game-btns").attr("data-state", state)
          }, 4000);
        }
        break;
    }
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
    gameBetList &&
      gameBetList.forEach(function(item) {
        if (baseInfo.id != item.userId) {
          // console.info(item.userId, $("#" + item.userId), $("#3"));
          var seatIndex = $("#" + item.userId).attr("data-index");
          // console.info(item.userId, seatIndex);
          bets(seatIndex, item.betMoney, { x: item.x, y: item.y });
        }
      });
  }

  function countDown(count, cb) {
    $(".game-count-down").html(count);
    var countInterval = setInterval(function() {
      if (count == 1) {
        clearInterval(countInterval);
        // rob(0,true);
        cb && cb();
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
        totalChip += +chip;

        if (totalChip <= 100) {
          // gameCode.push(value);
          var x = e.clientX - 10,
            y = e.clientY - 12;
          bets(0, chip, { x: x, y: y });
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
    var type = $(this).attr("data-type");
    switch (type) {
      case "ready":
        //准备
        ready();
        break;
      case "rob":
        //抢庄
        rob(1, false);
        break;
      case "norob":
        //不抢庄
        rob(2, false);
        break;
      case "db":
        //庄家定宝
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
   * 座位初始化
   * @param {string} totalCount 总人数
   * @param {*} roomUsersData 房间内玩家信息
   */
  function initSeat(roomData, roomUsersData) {
    var list = roomUsersData.roomUserDtoList;
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
    banker = null; //庄家的座位号
    gamer = []; //闲家的座位号
    if (CURRENT_MODE) {
      // var baseInfo = Util.getSession("BASE_INFO"),
      var curUser,
        gamerList = [];
      list.forEach(function(item) {
        if (item.userId == baseInfo.id) {
          curUser = item;
        } else {
          gamerList.push(item);
        }
      });

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

      // 当前用户模版
      var _temp =
        '<div id="' +
        curUser.userId +
        '" class="seat current-user ' +
        curUserStatus.robClass +
        " " +
        curUserStatus.bankerClass +
        '"  style="top:' +
        CURRENT_MODE[0].top +
        "; left:" +
        CURRENT_MODE[0].left +
        "; right: " +
        CURRENT_MODE[0].right +
        '" data-index="0">' +
        "<figure class='" +
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
        "</span>" +
        "</div>";

      var useRandomSeats = randomSeats.slice(0, gamerList.length);

      for (var i = 1, len = CURRENT_MODE.length; i < len; i++) {
        // 如果有人就编辑玩家模版，如果没有就编译空位置模版
        var mode_item = CURRENT_MODE[i];
        if (useRandomSeats.indexOf(i) != -1) {
          var gamerData = gamerList.pop();
          var gamerStatus = getGamerStatus(
            gamerData,
            roomData.state,
            roomUsersData.userIdOfRob
          );
          if (gamerStatus.isBanker) {
            banker = i;
          } else {
            gamer.push(i);
          }

          _temp +=
            ' <div id="' +
            gamerData.userId +
            '" class="seat gamer ' +
            gamerStatus.robClass +
            " " +
            gamerStatus.bankerClass +
            (mode_item.class || "") +
            '"  style="top:' +
            mode_item.top +
            "; left:" +
            mode_item.left +
            "; right: " +
            mode_item.right +
            '" data-index="' +
            i +
            '">' +
            "<figure class='" +
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
            "</div>" +
            "</div>";
        } else {
          _temp +=
            '<div id="seat' +
            i +
            '"  class="seat empty ' +
            (mode_item.class || "") +
            '" data-index="' +
            i +
            '" style="top:' +
            mode_item.top +
            "; left:" +
            mode_item.left +
            "; right: " +
            mode_item.right +
            '"></div>';
        }
      }
    }

    $(".gamer-group")
      .addClass("mode" + totalCount)
      .append(_temp);
    if (roomData.state == 3) {
      // 抢庄完成：这里要调用动态效果，轮询定庄，定完庄后，调用接口修改房间状态；
      creatBankerTrack();
      GameApi.updateState(roomId);
    }
    // ----- 测试赢钱 -------
    // initTrack(banker, gamer);
    // // if (!banker) return;

    // gamer.forEach(function(g) {
    //   // 如果赢了就加上earn样式，否则就remove earn样式
    //   $("#track" + g + "_" + banker).addClass("earn");
    // });
    // $(".money-track-group").show();
    // ------ 测试赢钱 end ------
  }

  function getGamerStatus(data, state, userIdOfRob) {
    var result = {
      userImg: data.userImg ? data.userImg : "../images/bg_avator.png",
      robClass: "",
      bankerClass: "",
      readyClass: "",
      isBanker: false
    };
    if (state == 2 && +data.isRob) {
      //state (integer): 游戏状态：1准备中、2抢庄中、3抢庄完成、4定宝中、5下注中、6开奖中
      //isRob (integer): 是否抢庄：0未操作、1抢庄、2不抢
      result.robClass = data.isRob == 1 ? "rob" : "norob";
    }
    if (data.userId == userIdOfRob) {
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
      end = $(".banker").offset();
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
  function bets(seatIndex, chip, endPos) {
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
    var $chip = $("<div/>")
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
        "-webkit-transform":
          "translate(" +
          (end[0] - start[0]) +
          "px, " +
          (end[1] - start[1]) +
          "px)",
        "-ms-transform":
          "translate(" +
          (end[0] - start[0]) +
          "px, " +
          (end[1] - start[1]) +
          "px)",
        transform:
          "translate(" +
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
      type = _target.attr("data-type");
    $(".msg-masker").trigger("click");
  });
})();
