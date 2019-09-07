(function() {
  FastClick.attach(document.body);
    var roomId = Util.getParam('id'),
    numberOfGame = 0;
   // 当前窗口宽度
   var WIN_WIDTH = $(window).width();
   // 当前窗口高度
   var WIN_HEIGHT = $(window).height();
  // 位置模式, 座位，从左下角当前登录者开始，顺时针布局
  var SEAT_MODE = {
    MODE10: [
      {top: getPercent(1008, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(852, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(696, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(540, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(382, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(224, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(435, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(596, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(750, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(911, 'h'), left: 'initial', right: getPercent(22, 'w')},
    ],
    MODE13: [
      {top: getPercent(1010, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(853, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(696, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(540, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(383, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(226, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(69, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(120, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(278, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(436, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(595, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(753, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(911, 'h'), left: 'initial', right: getPercent(22, 'w')},
    ],
    MODE16: [
      {top: getPercent(1069, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(935, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(800, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(666, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(531, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(397, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(262, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(128, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(120, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(245, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(369, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(493, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(617, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(741, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(865, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(989, 'h'), left: 'initial', right: getPercent(22, 'w')},
    ],
    MODE20: [
      {top: getPercent(1047, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(930, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(813, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(696, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(581, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(464, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(347, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(230, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(113, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(141, 'h'), left: getPercent(206, 'w'), right: 'initial'},
      {top: getPercent(141, 'h'), left: 'initial', right: getPercent(198, 'w')},
      {top: getPercent(120, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(231, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(342, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(453, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(564, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(674, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(785, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(896, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(1007, 'h'), left: 'initial', right: getPercent(22, 'w')},
    ],
    MODE30: [
      {top: getPercent(1047, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(930, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(813, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(696, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(581, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(464, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(347, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(230, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(113, 'h'), left: getPercent(19, 'w'), right: 'initial'},
      {top: getPercent(89, 'h'), left: getPercent(131, 'w'), right: 'initial', class: 'small'},
      {top: getPercent(172, 'h'), left: getPercent(119, 'w'), right: 'initial'},
      {top: getPercent(172, 'h'), left: getPercent(206, 'w'), right: 'initial'},
      {top: getPercent(172, 'h'), left: getPercent(294, 'w'), right: 'initial'},
      {top: getPercent(172, 'h'), left: 'initial', right: getPercent(296, 'w')},
      {top: getPercent(172, 'h'), left: 'initial', right: getPercent(208, 'w')},
      {top: getPercent(89, 'h'), left: 'initial', right: getPercent(135, 'w'), class: 'small'},
      {top: getPercent(172, 'h'), left: 'initial', right: getPercent(121, 'w')},
      {top: getPercent(120, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(231, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(342, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(453, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(564, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(674, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(785, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(896, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(1007, 'h'), left: 'initial', right: getPercent(22, 'w')},
      {top: getPercent(958, 'h'), left: 'initial', right: getPercent(111, 'w'), class: 'small'},
      {top: getPercent(958, 'h'), left: 'initial', right: getPercent(188, 'w'), class: 'small'},
      {top: getPercent(958, 'h'), left: getPercent(193, 'w'), right: 'initial', class: 'small'},
      {top: getPercent(958, 'h'), left: getPercent(116, 'w'), right: 'initial', class: 'small'},
    ]
  };
  //页面初始化
  (function() {
    getRoomDetail(false);
    getUserOfRoom(0);

    var antiPlug = new AntiPlug();
    antiPlug.show();
    //防外挂
    // var baseInfo = Util.getSession(Util.baseInfo);
    // if (baseInfo.sign) {
    //   $(".popup-edit-sign").show();
    // } else {
    //   showUserInfo(baseInfo);
    // }
  })();

//   function showUserInfo(info) {
//     // var info = Util.getSession(Util.baseInfo);
//     //   console.info(info)
//     if (!info) return;
//     var $fwgInfo = $("#fwgInfo");
//     $fwgInfo.find("#fwgAvator").src = info.img;
//     $fwgInfo.find("#fwgName").html(info.nickName);
//     $fwgInfo.find("#fwgIdfwgId").html("ID:" + info.memberNumber);
//     $fwgInfo.find("#fwgLevel").html(info.level + "级");
//     $fwgInfo.find(".sign-txt").html(info.sign);
//     $(".popup-info").show();
//   }

//   // 修改签名按钮事件
//   $(".es-btn").on("click", function() {
//     var type = $(this).attr("data-type");
//     var signValue = $("#signInput").val();

//     if (type === "show") {
//       if (!signValue) return;
//       $(".sign-sumbit-wrapper").show();
//       return;
//     }
//     if (type === "cancle") {
//       $(".popup-edit-sign").hide();
//       $("#signInput").val("");
//       $(".sign-sumbit-wrapper").hide();
//       return;
//     }
//     if (type === "submit") {
//         Util.updateSign(signValue);
//     }
//   });
//    //关闭弹窗
//    $(".masker").on("click", function() {
//     // $(".create-room-popup").hide();
//     $(".popup-wrapper").hide();
//   });
  /**
   * 获取房间的详细信息
   * @param {Boolean} useResult 是否需要开奖结果
   */
  function getRoomDetail(useResult) {
    Util.Ajax({
        url: Util.openAPI + "/app/room/get",
        type: "get",
        dataType: "json",
        data: {
            id: roomId,
            useResult: useResult
        },
        cbOk: function(data, textStatus, jqXHR) {
          // console.log(data);
          if (data.code === 0) {
            var data = data.data,
            $roomMsg = $('.ab-room');
            $roomMsg.find('#roomNumber').html(data.roomNumber);
            $roomMsg.find('#number').html(data.numberOfOpen + '/' + data.numberOfGame);
            $roomMsg.find('#type').html(data.type);
            $roomMsg.find('#odds').html(data.oddsString);
            $roomMsg.find('#chipLimit').html(data.chipLimit);
            numberOfGame += data.numberOfOpen;
          } else {
            Util.toast(data.msg);
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("获取房间信息失败");
        }
      });
  }
  /**
   * 获取当前房间的状态以及人员信息
   * @param {int}numberOfGame 当前局数
   */
  function getUserOfRoom(numberOfGame) {
    Util.Ajax({
        url: Util.openAPI + "/app/roomUser/getUserOfRoom",
        type: "get",
        dataType: "json",
        data: {
            id: roomId,
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
          Util.toast("获取房间状态信息失败");
        }
      });
  }


  // 当前座位模式
  var CURRENT_MODE = [];
  // 随机座位（除去当前登录人）
  var randomSeat = getRandSeats(9);
  // 初始化座位
  initSeat(30);
  // 位置
  var $seats = $('.seat');
  // 根据庄家的位置，和参与者的位置，初始化金币轨道（每局游戏抢庄结束后都要重新初始化）
  var banker = 29, gamer = [8, 9, 20];
  initTrack(banker, gamer);

  // ----- 测试赢钱 -------
  gamer.forEach(function(g) {
    // 如果赢了就加上earn样式，否则就remove earn样式
    $('#track' + g + '_' + banker ).addClass('earn')
  });
  $('.money-track-group').show();
  // ------ 测试赢钱 end ------

  // 点击下注盘
  $('.an-game-content').on('click', '.item', function(e) {
    var $target = $(e.currentTarget),
    type = $target.attr('data-type'),
    id = $target.attr('id');
    value = $target.attr('data-value');
    console.log(type + ': ' + value)
    // 必须是有效区域才能下注
    if (type === 'code') {
      // 当前筹码
      var chip = $('.chip.active').attr('data-value');
      // 当前登录人下注
      if (chip) {
        bets(0, chip, {x: e.clientX - 10, y: e.clientY - 12});
      } else {
        Util.toast('请选择筹码');
      }
    }
   
  })
  // 点击筹码
  $('.chip-group').on('click', '.chip', function(e) {
    var $target = $(e.currentTarget),
        chip = $target.attr('data-value');
    $('.chip').removeClass('active');
    $target.addClass('active');
  })

  /**
   * @desc 获取宽度或者高度百分比
   * @param {number} num 数值
   * @param {string} type: w-宽度；h-高度
   */
  function getPercent(num, type) {
    var _num = type === 'w' ? 750 : 1206;
        _device = type === 'w' ? WIN_WIDTH : WIN_HEIGHT;
    return (num / _num * _device).toFixed(0) + 'px';
  }

  /** 
   * 座位初始化
   * @param {string} totalCount 总人数
   */
  function initSeat(totalCount) {
    // 如果人多，样式修改
    if(totalCount >= 20) {
      $('.ab-txt').addClass('small')
      $('.ab-room').addClass('more')
    }
    if(totalCount >= 30) {
      $('.an-game-content').addClass('lower')
    }
    
    // 获取当前位置模式，即位置数据
    CURRENT_MODE = SEAT_MODE['MODE' + totalCount];
    if(CURRENT_MODE) {
      // 当前用户模版
      var _temp = '<div id="seat0" class="seat current-user" data-value="0" style="top:'+ CURRENT_MODE[0].top +'; left:'+ CURRENT_MODE[0].left +'; right: '+ CURRENT_MODE[0].right +'">'+
      '<figure>'+
        '<img src="../images/anbao/pic_game_center.png"/>'+
        '<figcaption>ohayo</figcaption>'+
      '</figure>'+
      '<div class="score">12</div>'+
      '<span class="member-no">23234738</span>'+
    '</div>';
      for(var i = 1; i < CURRENT_MODE.length; i ++) {
        // 如果有人就编辑玩家模版，如果没有就编译空位置模版
        var mode_item = CURRENT_MODE[i];
        if (randomSeat.indexOf(i) != -1) {
          _temp += ' <div id="seat'+ i +'" class="seat gamer ' + (mode_item.class || '') +'" data-value="0" style="top:'+ mode_item.top +'; left:'+ mode_item.left +'; right: '+ mode_item.right +'">'+
            '<figure>'+
              '<img src="../images/anbao/pic_game_center.png"/>'+
              '<figcaption>ohayo</figcaption>'+
            '</figure>'+
            '<div class="score">12</div>'+
          '</div>';
        } else {
          _temp += '<div id="seat'+ i +'"  class="seat empty ' + (mode_item.class || '') +'" data-value="'+ i +'" style="top:'+ mode_item.top +'; left:'+ mode_item.left +'; right: '+ mode_item.right +'"></div>';
        }
       
      }
    }
    $('.gamer-group').addClass('mode' + totalCount).append(_temp);
  }
  /**
   * 随机选取座位
   * @param {number} count - 选取的座位数 
   */
  function getRandSeats(count) {
    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
              10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    var randomSeats = arr.sort(function() {
      return Math.random() - 0.5;
    }).slice(0, count);
    return randomSeats;
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
    var start = $($seats[seatStart]).offset(),
        end = $($seats[seatEnd]).offset()
    var trackHeight = Math.sqrt(Math.pow((start.left - end.left), 2) + Math.pow((start.top - end.top), 2));
    var deg = getSinDeg((end.top - start.top)/trackHeight);
    
    deg = start.left - end.left > 0 ? 90 - deg : deg - 90;
    var coins = '<i class="coins"></i><i class="coins1"></i><i class="coins2"></i>';
    var $track = $('<div/>').addClass('money-track')
      .attr('id', 'track' + seatStart + '_' + seatEnd)  
      .css({
      height: trackHeight + 'px',
      top: start.top + 10 + 'px',
      left: start.left + 2 + 'px',
      '-webkit-transform': 'rotate(' + deg + 'deg)',
      '-ms-transform': 'rotate(' + deg + 'deg)',
      'transform': 'rotate(' + deg + 'deg)',
    }).html(coins);
    $('.money-track-group').append($track);
  }
  /**
   * 
   * @param {number} banker - 庄家的座位号
   * @param {array} gamers - 游戏者的座位号数组
   */
  function initTrack(banker, gamers) {
    // 清空轨道
    $('.money-track-group').html('');
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
    if (seat.left  === 'initial') {
      var x = WIN_WIDTH - parseInt(seat.right.replace('px', '')) - $('#seat' + seatIndex).width() + 5;
    } else {
      var x = parseInt(seat.left.replace('px', ''));
    }
    var y = parseInt(seat.top.replace('px', ''))  + 15
    return [x, y]
  }
  /** 
   * 根据下注id，获取下注吗的最终位置
   * @param {string}targetId 目标id
   */
  function getEndPos(targetId) {
    var $target = $('#' + targetId);
    var x = $target.offset().left + 10,
       y = $target.offset().top + 5
    switch (targetId) {
      case 'item9':
      case 'item14':
      case 'item19':
      x -= 5;
      break;
      case 'item13':
      x += 15;
      break;
      case 'item16':
      case 'item17':
      case 'item18': 
      y += 30;
      break;
      case 'item25':
      case 'item26':
      case 'item27':
      case 'item28':
      x += 30;
      y += 35;
    }
    return [x, y]
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
      // 结束坐标
      // var end = getEndPos(targetId);
      var end = [endPos.x, endPos.y];
      // 初始化下注码
      // if ($chip.length <= 0) {
        var $chip = $('<div/>')
          // .attr('id', 'chip_move' + seatIndex)
          .addClass('chip')
          .addClass('move')
          .addClass('chip-move' + seatIndex)
          .addClass('transition')
          .css({top:  start[1] + 'px',left: start[0] + 'px'})
        $('.main-content').append($chip);
      // }
      $chip.addClass('chip' + chip);
      
      // 下注码的目标位置
      setTimeout(function() {
        $chip.css({
          '-webkit-transform': 'translate('+ (end[0] - start[0])+'px, '+ (end[1] - start[1])+'px)',
          '-ms-transform': 'translate('+ (end[0] - start[0])+'px, '+ (end[1] - start[1])+'px)',
          'transform': 'translate('+ (end[0] - start[0])+'px, '+ (end[1] - start[1])+'px)',
        })
      }, 0);

      // setTimeout(function(e) {
      //   $chip.remove();
      // }, 300);
  }
})();
