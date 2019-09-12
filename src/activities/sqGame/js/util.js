"use strick";

(function(global) {
  var openAPI = "http://119.23.201.149:8081"; // dev
  // var openAPI = "http://www.carfriend99.net"; //pro

  var TOKEN = "TOKEN";
  var BASE_INFO = "BASE_INFO";
  var LISTCONFIG = {
    //上拉加载的配置项
    up: {
      isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
      noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
      empty: {
        icon: null, //图标,默认null
        tip: "暂无相关数据~", //提示
        btntext: "", //按钮,默认""
        btnClick: null
      },
      // clearEmptyId: null, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
      //   toTop: {
      //     //配置回到顶部按钮
      //     src: "../res/img/mescroll-totop.png" //默认滚动到1000px显示,可配置offset修改
      //     //offset : 1000
      //   },
      lazyLoad: {
        use: false // 是否开启懒加载,默认false
      }
    }
  };

  /**
   * 微信授权
   * @param {string} code
   * @param {func} cb
   */
  function auth(code, cb) {
    // 若code 不为空，说明授权成功， 获取用户信息
    if (code) {
      Util.Ajax({
        url: Util.openAPI + "/app/authUserInfo",
        type: "get",
        data: {
          code: code
        },
        dataType: "json",
        cbOk: function(data, textStatus, jqXHR) {
          console.log(data);
          if (data.code === 0) {
            // window.sessionStorage['TOKEN'] = data.data.token
            // Util.setSession([Util.token], 1234);

            // Util.setSession(TOKEN, "c060689f35c0423ca050691c23806db5");
            Util.setSession(TOKEN, "9417832d2b944869918f58eb76239dbb");
            // Util.setSession(TOKEN, data.data.token);

            cb && cb(data.data.token);
          } else {
            Util.toast("授权失败，请重新尝试");
          }
        },
        cbErr: function(e, xhr, type) {
          Util.toast("授权失败，请重新尝试");
        }
      });
      return;
    }
    // 若code为空，那么进行微信授权
    var _url = window.location.href;
    window.location.href = Util.openAPI + "/app/redirectUrl?url=" + _url; // 带上重定向地址
    return;
  }

  /**
   * 获取用户信息
   * @param {*} cb
   */
  function getUserInfo(cb) {
    Util.Ajax({
      url: openAPI + "/app/newUser/baseInfo",
      type: "get",
      data: {},
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          // console.log(data.data)
          // 设置个人信息
          var _data = data.data;
          // Util.setSession([Util.baseInfo], _data);
          Util.setSession(BASE_INFO, _data);
          cb && cb(_data);

          // var $baseinfo = $("#base_info");
          // $baseinfo.find(".header-title").html(_data.nickName);
          // $baseinfo.find(".header-id").html("ID:" + _data.memberNumber);
          // $baseinfo.find(".header-num").html(_data.roomCount);

          // if (_data.sign) {
          //   $("#sign").html(_data.sign);
          // } else {
          //   // TODO 弹窗提示输入签名
          //   $(".popup-edit-sign").show();
          // }
        } else {
          Util.toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("获取个人信息失败，请重新登录");
      }
    });
  }

  /**
   * @func
   * @desc getCookie - 获取cookie
   * @param {string} name - 对应的key，必填
   */
  function getCookie(name) {
    var arr,
      reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  /**
   * @func
   * @desc getParam - 获取从url带过来的参数
   * @param {string} name - 对应的key，必填
   * @param {string} [url] - 指定url，选填， 默认window.location.href
   */
  function getParam(name, url) {
    url = url || window.location.href;
    var paramString = url.substring(url.indexOf("?") + 1, url.length);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = paramString.match(reg);

    if (r != null) return decodeURIComponent(r[2]);
    return null;
  }

  /**
   * @func
   * @desc setParam - 设置url参数
   * @param {string} param - 对应的key，必填
   * @param {string} value - 对应value
   */
  function setParam(param, value) {
    var query = location.search.substring(1);
    var p = new RegExp("(^|&" + param + ")=[^&]*");
    if (p.test(query)) {
      query = query.replace(p, "$1=" + value);
      location.search = "?" + query;
    } else {
      if (query == "") {
        location.search = "?" + param + "=" + value;
      } else {
        location.search = "?" + query + "&" + param + "=" + value;
      }
    }
  }

  /**
   * @func
   * @desc setSession - 保存到session
   * @param {string} key - 对应的key，必填
   * @param {string} value - 对应value
   */
  function setSession(key, value) {
    window.sessionStorage[key] = value ? JSON.stringify(value) : "";
  }

  /**
   * @func
   * @desc getSession - 保存到session
   * @param {string} key - 对应的key，必填
   */
  function getSession(key, value) {
    var _value = window.sessionStorage[key];
    return _value ? JSON.parse(_value) : "";
  }

  /**
   * @func
   * @desc toast - 冒泡提示
   * @param {string} msg - 提示信息，必填
   * @param {string} [duration] - 停留时间，选填， 默认1500ms
   */
  function toast(msg, duration) {
    var _toast = $("<div/>").addClass("toast"),
      _msg = $("<span/>").html(msg);
    _toast.append(_msg);
    $("body").append(_toast);
    setTimeout(function() {
      _toast.remove();
    }, duration || 1500);
  }
  /**
   * @func
   * @desc spToast - 冒泡提示
   * @param {string} msg - 提示信息，必填
   * @param {string} [duration] - 停留时间，选填， 默认1500ms
   */
  function spToast(msg, duration) {
    var _toast = $("<div/>").addClass("toast sp-toast"),
      _msg = $("<span/>").html(msg);
    _toast.append(_msg);
    $("body").append(_toast);
    setTimeout(function() {
      _toast.remove();
    }, duration || 1500);
  }

  /**
   * @func
   * @desc showLoader - 显示loading
   */
  function showLoader() {
    var temp =
        '<div class="loader-wrapper"><svg class="spinner show" viewBox="0 0 44 44"><circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle> </svg></div>',
      $loader = $(".loader-wrapper");
    if ($loader.length > 0) {
      $loader.show();
    } else {
      $("body").append(temp);
    }
  }

  /**
   * @func
   * @desc hideLoader - 隐藏loading
   */
  function hideLoader() {
    $(".loader-wrapper").hide();
  }

  /**
   * @func
   * @desc Ajax 请求
   * @param {config} config - 配置参数
   * @param {string} config.url - 请求路径，选填
   * @param {string} config.type - 请求类型，必填
   * @param {object} config.data - 请求参数，必填
   * @param {string} config.dataType - 返回数据类型，必填
   * @param {function} [config.beforeSend] - 请求发送前事件，选填
   * @param {function} [config.cbOk] - 请求成功事件，选填
   * @param {function} [config.cbErr] - 请求失败事件，选填
   * @param {function} [config.cbCp] - 请求完成事件，选填
   * @param {boolean} [loader] - 是否有loader, 选填，不填的时候，默认为false
   */
  function Ajax(config, loader) {
    $.ajax({
      timeout: 20 * 1000,
      url: config.url,
      type: config.type,
      data: config.data,
      dataType: config.dataType,
      // contentType: 'application/json;charset=utf-8',
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      beforeSend: function(xhr, settings) {
        if (loader) {
          showLoader();
        }
        // console.info('token---', window.sessionStorage[TOKEN], Util.getSession(TOKEN))
        xhr.setRequestHeader("token", Util.getSession(TOKEN));
        // xhr.setRequestHeader("token", window.sessionStorage[TOKEN]);

        config.beforeSend && config.beforeSend(xhr, settings);
      },
      success: function(data, textStatus, jqXHR) {
        config.cbOk && config.cbOk(data, textStatus, jqXHR);
      },
      error: function(e, xhr, type) {
        config.cbErr && config.cbErr(e, xhr, type);
      },
      complete: function(xhr, status) {
        if (loader) {
          hideLoader();
        }
        config.cbCp && config.cbCp(xhr, status);
      }
    });
  }

  /**
   * @func
   * @desc popup 对话框
   * @param {options} options - 配置参数
   * @param {string} [options.title] - 对话框标题，选填
   * @param {string} options.content - 对话框提示信息，必填
   * @param {object[]} options.btns - 参数btns为一个对象数组，必填
   * @param {string} btns.name - 参数btns数组中一项的name属性，表示按钮名称
   * @param {string} btns.cb - 参数btns数组中一项的cb，表示对应按钮的回调函数
   */
  function popup(options) {
    var _options = {
      title: "",
      content: "",
      btns: [
        {
          name: "",
          cb: function() {}
        },
        {
          name: "",
          cb: function() {}
        }
      ]
    };
    _options = $.extend(_options, options || {});
    var dialog_component = $("<div/>")
        .addClass("popup")
        .addClass("component-dialog"),
      masker = $("<div/>").addClass("masker"),
      dialog_wrapper = $("<div/>").addClass("pop-wrapper"),
      dialog_title = _options.title
        ? $("<div/>")
            .addClass("pop-title")
            .html(_options.title)
        : "",
      dialog_content = $("<div/>")
        .addClass("pop-content")
        .html(_options.content),
      btns = $("<div/>").addClass("btns"),
      _btn_temp = "";
    dialog_wrapper.append(dialog_title).append(dialog_content);
    for (var i = 0; i < _options.btns.length; i++) {
      _btn_temp += "<button>" + _options.btns[i].name + "</button>";
    }
    btns.html(_btn_temp);
    dialog_wrapper.append(btns);
    dialog_component.append(masker).append(dialog_wrapper);
    $("body").append(dialog_component); // 事件绑定
    masker.bind("click", function(e) {
      hide(dialog_component);
    });
    btns.on("click", "button", function(e) {
      var $target = $(e.currentTarget);
      var cb = _options.btns[$target.index()].cb;
      cb && cb.call(this, arguments);
      hide(dialog_component);
    });
    function hide(target) {
      target.remove();
    }
  }
  function wxConfig(readyCb) {
    if (!wx) {
      console.error("请引入微信js-sdk");
      return;
    }
    Ajax({
      url: "/app/wechat/wxjsconfig",
      type: "get",
      data: {
        url: encodeURIComponent(window.location.href.split("#")[0])
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          var _data = data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: _data.appId, // 必填，公众号的唯一标识
            timestamp: _data.timestamp, // 必填，生成签名的时间戳
            nonceStr: _data.nonceStr, // 必填，生成签名的随机串
            signature: _data.signature, // 必填，签名，见附录1
            jsApiList: [
              "onMenuShareTimeline",
              "onMenuShareAppMessage"
              // 'updateAppMessageShareData',
              // 'updateTimelineShareData'
            ] // 必填，需要使用的JS接口列表。
          });

          wx.ready(function() {
            console.log("ready");
            readyCb && readyCb();
          });
        }
      },

      cbErr: function(e, xhr, type) {
        // Util.toast('信息查询失败，请稍后再试');
      }
    });
  }

  /**
   * 根据游戏id，获取游戏配置
   * @param {string} id 游戏id
   * @param {function} cb 回调函数
   */
  function getParamsOfGame(id, cb) {
    Ajax({
      url: Util.openAPI + "/app/game/getParamsOfGame",
      type: "get",
      data: {
        id: id
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (data.code === 0) {
          var data = data.data;
          var temp = "";
          if (data.chips) {
           
            temp += getTemp(data.chips, "chips", "chips", "筹码：");
          }
          if (data.chipLimits) {
            temp += getTemp(
              data.chipLimits,
              "chipLimits",
              "chipLimit",
              "上限："
            );
          }
          if (data.gameNumberOfGameList) {
            temp +=
              '<li class="cr-items"><div class="item-title">局数：</div><div class="checkbox-list">';
            data.gameNumberOfGameList.forEach(function(item, k) {
              if (k === 0) {
                temp +=
                  '<input type="radio" id="gameNumber' +
                  k +
                  '" name="gameNumberOfGameList" value="' +
                  item.numberOfGame +
                  "," +
                  item.roomCard +
                  '" checked/>';
              } else {
                temp +=
                  '<input type="radio" id="gameNumber' +
                  k +
                  '" name="gameNumberOfGameList" value="' +
                  item.numberOfGame +
                  "," +
                  item.roomCard +
                  '"/>';
              }
              temp +=
                '<label for="gameNumber' +
                k +
                '">' +
                item.numberOfGame +
                "局 x " +
                item.roomCard +
                "房卡</label>";
            });
            temp += "</div></li>";
          }
          if (data.peoples) {
            temp +=
              '<li class="cr-items"><div class="item-title">人数：</div><div class="checkbox-list">';
            data.peoples.forEach(function(item, k) {
              if (k === 0) {
                temp +=
                  '<input type="radio" id="people' +
                  k +
                  '" name="peoples" value="' +
                  item.people +
                  '" checked/>';
              } else {
                temp +=
                  '<input type="radio" id="people' +
                  k +
                  '" name="peoples" value="' +
                  item.people +
                  '"/>';
              }
              temp +=
                '<label for="people' + k + '">' + item.people + "人</label>";
            });
            temp += "</div></li>";
          }
          if (data.betTimes) {
            temp +=
              '<li class="cr-items"><div class="item-title">下注时间：</div><div class="checkbox-list">';
            data.betTimes.forEach(function(item, k) {
              if (k === 0) {
                temp +=
                  '<input type="radio" id="betTime' +
                  k +
                  '" name="betTimes" value="' +
                  item.betTime +
                  '" checked/>';
              } else {
                temp +=
                  '<input type="radio" id="betTime' +
                  k +
                  '" name="betTimes" value="' +
                  item.betTime +
                  '"/>';
              }
              temp +=
                '<label for="betTime' +
                k +
                '">' +
                item.betTime +
                "秒</label>";
            });
            temp += "</div></li>";
          }
          if (data.oddsOfPlayList) {
            temp +=
              '<li class="cr-items"><div class="item-title">赔率：</div></li>';
            data.oddsOfPlayList.forEach(function(obj, i) {
              temp +=
                '<li class="cr-items"><div class="item-title">' +
                obj.name +
                '</div><div class="checkbox-list">';
              obj.gamePlayOddsList.forEach(function(item, k) {
                if (k === 0) {
                  temp +=
                    '<input type="radio" class="playOdds" id="playOdds' +
                    i * 10 +
                    k +
                    '" name="playOdds' +
                    item.gamePlayId +
                    '" value="' +
                    item.gamePlayId +
                    "," +
                    item.odds +
                    '" checked/>';
                } else {
                  temp +=
                    '<input type="radio" class="playOdds" id="playOdds' +
                    i * 10 +
                    k +
                    '" name="playOdds' +
                    item.gamePlayId +
                    '" value="' +
                    item.gamePlayId +
                    "," +
                    item.odds +
                    '"/>';
                }
                temp +=
                  '<label for="playOdds' +
                  i * 10 +
                  k +
                  '">' +
                  item.name +
                  "</label>";
              });
              temp += "</div></li>";
            });
          }

          // $(".cr-content").html(temp);
          cb && cb(temp);
        } else {
          toast(data.msg);
        }
      },
      cbErr: function(e, xhr, type) {
        toast("获取游戏参数失败");
      }
    });
  }

  function getTemp(list, datakey, itemKey, text) {
    var temp =
      '<li class="cr-items"><div class="item-title">' +
      text +
      '</div><div class="checkbox-list">';
    list.forEach(function(item, k) {
      if (k === 0) {
        //默认选中第一项
        temp +=
          '<input type="radio" id="' +
          datakey +
          k +
          '" name="' +
          datakey +
          '" value="' +
          item[itemKey] +
          '" checked/>';
      } else {
        temp +=
          '<input type="radio" id="' +
          datakey +
          k +
          '" name="' +
          datakey +
          '" value="' +
          item[itemKey] +
          '"/>';
      }
      temp +=
        '<label for="' + datakey + k + '">' + item[itemKey] + "</label>";
    });
    temp += "</div></li>";
    return temp;
  }
    
  var Util = {
    token: TOKEN,
    baseInfo: BASE_INFO,
    openAPI: openAPI,
    getCookie: getCookie,
    getParam: getParam,
    setParam: setParam,
    setSession: setSession,
    getSession: getSession,
    toast: toast,
    spToast: spToast,
    showLoader: showLoader,
    hideLoader: hideLoader,
    Ajax: Ajax,
    popup: popup,
    baseListConfig: LISTCONFIG,
    auth: auth,
    getUserInfo: getUserInfo,
    wxConfig: wxConfig,
    getParamsOfGame: getParamsOfGame
  };
  global.Util = Util;
})(window);
