"use strick";
(function(global) {
  /**
   * @desc 获取宽度或者高度百分比
   * @param {number} num 数值
   * @param {string} type: w-宽度；h-高度
   */
  // 当前窗口宽度
  var WIN_WIDTH = $(window).width();
  // 当前窗口高度
  var WIN_HEIGHT = $(window).height();
  function getPercent(num, type) {
    var _num = type === "w" ? 750 : 1206;
    _device = type === "w" ? WIN_WIDTH : WIN_HEIGHT;
    return ((num / _num) * _device).toFixed(0) + "px";
  }
  var SEAT_MODE = {
    MODE10: [
      {
        top: getPercent(1008, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(852, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(696, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(540, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(382, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(224, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(435, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(596, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(750, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      { top: getPercent(911, "h"), left: "initial", right: getPercent(22, "w") }
    ],
    MODE13: [
      {
        top: getPercent(1010, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(853, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(696, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(540, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(383, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(226, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      { top: getPercent(69, "h"), left: getPercent(19, "w"), right: "initial" },
      {
        top: getPercent(120, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(278, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(436, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(595, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(753, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      { top: getPercent(911, "h"), left: "initial", right: getPercent(22, "w") }
    ],
    MODE16: [
      {
        top: getPercent(1069, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(935, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(800, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(666, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(531, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(397, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(262, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(128, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(120, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(245, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(369, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(493, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(617, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(741, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(865, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      { top: getPercent(989, "h"), left: "initial", right: getPercent(22, "w") }
    ],
    MODE20: [
      {
        top: getPercent(1047, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(930, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(813, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(696, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(581, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(464, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(347, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(230, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(113, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(141, "h"),
        left: getPercent(206, "w"),
        right: "initial"
      },
      {
        top: getPercent(141, "h"),
        left: "initial",
        right: getPercent(198, "w")
      },
      {
        top: getPercent(120, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(231, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(342, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(453, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(564, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(674, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(785, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(896, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(1007, "h"),
        left: "initial",
        right: getPercent(22, "w")
      }
    ],
    MODE30: [
      {
        top: getPercent(1047, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(930, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(813, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(696, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(581, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(464, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(347, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(230, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(113, "h"),
        left: getPercent(19, "w"),
        right: "initial"
      },
      {
        top: getPercent(89, "h"),
        left: getPercent(131, "w"),
        right: "initial",
        class: "small"
      },
      {
        top: getPercent(172, "h"),
        left: getPercent(119, "w"),
        right: "initial"
      },
      {
        top: getPercent(172, "h"),
        left: getPercent(206, "w"),
        right: "initial"
      },
      {
        top: getPercent(172, "h"),
        left: getPercent(294, "w"),
        right: "initial"
      },
      {
        top: getPercent(172, "h"),
        left: "initial",
        right: getPercent(296, "w")
      },
      {
        top: getPercent(172, "h"),
        left: "initial",
        right: getPercent(208, "w")
      },
      {
        top: getPercent(89, "h"),
        left: "initial",
        right: getPercent(135, "w"),
        class: "small"
      },
      {
        top: getPercent(172, "h"),
        left: "initial",
        right: getPercent(121, "w")
      },
      {
        top: getPercent(120, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(231, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(342, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(453, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(564, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(674, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(785, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(896, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(1007, "h"),
        left: "initial",
        right: getPercent(22, "w")
      },
      {
        top: getPercent(958, "h"),
        left: "initial",
        right: getPercent(111, "w"),
        class: "small"
      },
      {
        top: getPercent(958, "h"),
        left: "initial",
        right: getPercent(188, "w"),
        class: "small"
      },
      {
        top: getPercent(958, "h"),
        left: getPercent(193, "w"),
        right: "initial",
        class: "small"
      },
      {
        top: getPercent(958, "h"),
        left: getPercent(116, "w"),
        right: "initial",
        class: "small"
      }
    ]
  };
  /**
   * 定完庄后，调用接口修改房间状态；
   * @param {*} roomId
   * @param {*} cb
   */
  function updateState(roomId, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/room/updateState",
      type: "post",
      dataType: "json",
      data: {
        roomId: roomId,
        state: 4
      },
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("更新状态信息失败");
      }
    });
  }
  /**
   * 庄家定宝
   * @param {*} params
   * @param {*} cb
   */
  function setResultCode(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/gameResult/setResultCode",
      type: "post",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("更新信息失败");
      }
    });
  }
  /**
   * 下注
   * @param {*} params
   * @param {*} cb
   */
  function bet(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/gameBet/bet",
      type: "post",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("下注失败");
      }
    });
  }
  /**
   * 下注统计
   * @param {*} params
   * @param {*} cb
   */
  function getStatResultOfBet(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/gameBet/getStatResultOfBet",
      type: "get",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取下注统计结果失败");
      }
    });
  }
  function getRoomDetail(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/room/get",
      type: "get",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
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
   * 获取房间内玩家数据
   * @param {*} params
   * @param {*} cb
   */
  function getUserOfRoom(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/roomUser/getUserOfRoom",
      type: "get",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取房间状态信息失败");
      }
    });
  }
  /**
   * 停止下注
   * @param {*} params
   * @param {*} cb
   */
  function stopBet(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/roomUser/stopBet",
      type: "post",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("停止下注失败，请稍后重试");
      }
    });
  }
  /**
   * 庄家开宝
   * @param {*} params
   * @param {*} cb
   */
  function open(params, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/room/open",
      type: "post",
      dataType: "json",
      data: params,
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          cb && cb(data);
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("开宝失败，请稍后重试");
      }
    });
  }

  var GameApi = {
    SEAT_MODE: SEAT_MODE,
    updateState: updateState,
    setResultCode: setResultCode,
    bet: bet,
    getStatResultOfBet: getStatResultOfBet,
    getRoomDetail: getRoomDetail,
    getUserOfRoom: getUserOfRoom,
    stopBet: stopBet,
    open: open
  };
  global.GameApi = GameApi;
})(window);
