(function() {
  FastClick.attach(document.body);
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
  // 当前座位模式
  var CURRENT_MODE = [];
 
  // 随机座位
  var randomSeat = [ 3, 29];
  initSeat(30);
  // bets(0, 10, 'item1');
  // bets(0, 10, 'item2');
  // bets(0, 10, 'item3');
  // bets(0, 10, 'item5');
  // bets(0, 10, 'item6');
  // bets(0, 10, 'item7');
  // bets(0, 10, 'item8');
  // bets(0, 10, 'item9');
  // bets(0, 10, 'item10');
  // bets(0, 10, 'item11');
  // bets(0, 10, 'item13');
  // bets(0, 10, 'item14');
  // bets(0, 10, 'item15');
  // bets(0, 10, 'item16');
  // bets(0, 10, 'item17');
  // bets(0, 10, 'item18');
  // bets(0, 10, 'item19');
  // bets(0, 10, 'item21');
  // bets(0, 10, 'item22');
  // bets(0, 10, 'item23');


  // bets(18, 10, 'item25');
  // bets(18, 20, 'item26');
  // bets(18, 30, 'item27');
  // bets(18, 50, 'item28');
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
      bets(0, chip, id);
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
   * @param [Number]{num} 数值
   * @param [String]{type} w-宽度；h-高度
   */
  function getPercent(num, type) {
    var _num = type === 'w' ? 750 : 1206;
        _device = type === 'w' ? WIN_WIDTH : WIN_HEIGHT;
    return (num / _num * _device).toFixed(0) + 'px';
  }

  /** 
   * 座位初始化
   * @param [String] {totalCount} 总人数
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
    $('.gamer-group').addClass('mode' + totalCount).html(_temp);
  }
  /** 
   * 根据座位，获取下注吗的起始位置
   * @param [Number]{seatIndex} 座位号，从0开始
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
   * @param [Number]{targetId} 目标id
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
   * @param [Number]{seatIndex} 座位号，从0开始
   * @param [Number]{chip} 筹码值 可选10, 20, 30, 50, 100
   * @param [String]{targetUd} 下注目标id
   */
  function bets(seatIndex, chip, targetId) {
      // 动画时间
      var dura = 300;
      // 起始坐标
      var start = getStartPos(seatIndex);
      // 结束坐标
      var end = getEndPos(targetId);
      // 初始化下注码
      // if ($chip.length <= 0) {
        // var chipNode = '<div id="chip_move'+ seatIndex +'" style="top:'+ start[1] +'px; left:' + start[0] + 'px" class="chip move"></div>';
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

      setTimeout(function(e) {
        $chip.remove();
      }, 300);
  }

  /**
   * 下注结束后，显示筹码
   * 
   */
  function showChipResult() {
    
  }
})();
