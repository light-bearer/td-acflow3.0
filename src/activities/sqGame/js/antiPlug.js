"use strick";
(function($, Util) {
  // var baseInfo = Util.getSession(Util.baseInfo);
  function updateSign(val, cb) {
    Util.Ajax({
      url: Util.openAPI + "/app/newUser/updateSign",
      type: "POST",
      data: {
        sign: val
      },
      dataType: "json",
      cbOk: function(data, textStatus, jqXHR) {
        console.log(data);
        if (data.code === 0) {
          Util.setSession(Util.token, data.data.token);
          Util.setSession(Util.baseInfo, data.data);

          cb && cb();
          //   Util.setSession(Util.token, 1234);
        } else {
          Util.toast("修改签名失败，请重新尝试");
        }
      },
      cbErr: function(e, xhr, type) {
        Util.toast("修改签名失败，请重新尝试");
      }
    });
  }

  var editSign = (function() {
    var _editSignPopup;
    return function() {
      if (!_editSignPopup) {
        _editSignPopup = $("<div/>").addClass("popup-wrapper popup-edit-sign");
        var _masker = $("<div/>").addClass("masker"),
          _signInputWrapper = $("<div/>")
            .addClass("popup-content edit-sign-content sign-input-wrapper")
            .html(
              '<p >诚邀广大玩家与我们一起抵制盗版！</p><p class="es-txt">请牢记自己的个性宣言和等级账号</p><p class="es-txt2">请认准你的等级账号</p>'
            ),
          _signInput = $("<input/>").addClass("es-input"),
          _inputBtn = $("<div/>")
            .addClass("es-btn-submit es-btn-input es-btn")
            .attr("data-type", "show"),
          _signSubmitWrapper = $("<div/>")
            .addClass("popup-content edit-sign-content sign-sumbit-wrapper")
            .html(
              "<p> 防外挂签名仅有一次设置机会，设置好后不能再更改；如再有提醒更改则为盗版平台！</p>"
            ),
          _esBtns = $("<div/>").addClass("es-btns"),
          _submitBtn = $("<div/>")
            .addClass("es-btn-submit es-btn")
            .attr("data-type", "submit"),
          _cancleBtn = $("<div/>")
            .addClass("es-btn-cancle es-btn")
            .attr("data-type", "cancle");

        _signInput
          .attr("placeholder", "请输入个性宣言")
          .attr("id", "signInput");
        _signInputWrapper.append(_signInput).append(_inputBtn);

        _esBtns.append(_submitBtn).append(_cancleBtn);
        _signSubmitWrapper.append(_esBtns);

        _editSignPopup
          .append(_masker)
          .append(_signInputWrapper)
          .append(_signSubmitWrapper);

        $("body").append(_editSignPopup);

        _masker.on("click", function() {
          _editSignPopup.hide();
        });
        _editSignPopup.on("click", ".es-btn", function() {
          var type = $(this).attr("data-type");
          var signValue = $("#signInput").val();

          if (type === "show") {
            if (!signValue) return;
            _signSubmitWrapper.show();
            return;
          }
          if (type === "cancle") {
            // $(".popup-edit-sign").hide();
            // _signInputWrapper.hide();
            $("#signInput").val("");
            _editSignPopup.hide();
            _signSubmitWrapper.hide();
            return;
          }
          if (type === "submit") {
            updateSign(signValue, function() {
              _editSignPopup.hide();
            });
          }
        });
      }
      return _editSignPopup;
    };
  })();

  var infoPopup = (function() {
    var baseInfo = Util.getSession(Util.baseInfo),
      img = baseInfo.img ? baseInfo.img : "../images/bg_avator.png";
    var _infoPopup;
    return function() {
      if (!_infoPopup) {
        _infoPopup = $("<div/>").addClass("popup-wrapper popup-info");
        var _masker = $("<div/>").addClass("masker"),
          _popupContent = $("<div/>")
            .addClass("popup-content info-content")
            .html('<p class="info-remark">请认准防外挂签名，ID和等级</p>'),
          _closeIcon = $("<i/>").addClass("icon-close close-popup-info"),
          _infoText = $("<i/>").addClass("icon-info-txt"),
          _infoDetWrapper = $("<section/>").addClass("info-det-wrapper"),
          _infoAvator = $("<div/>")
            .addClass("info-avator-wrapper")
            .html('<img src="' + img + '" id="fwgAvator" />'),
          _infoDet = $("<div/>")
            .addClass("info-det")
            .html(
              '<p class="info-first-row"><span id="fwgName">' +
                baseInfo.nickName +
                '</span><span id="fwgId">ID:' +
                baseInfo.memberNumber +
                '</span></p><p><span id="fwgLevel">' +
                baseInfo.level +
                '级</span><span class="progress-bg"><i class="info-progress" style="width:10%;"></i></span></p>'
            ),
          _signWrapper = $("<div/>")
            .addClass("sign-wrapper")
            .html(
              '<span>防外挂签名：</span><span class="sign-txt">' +
                baseInfo.sign +
                "</span>"
            );
        _infoDetWrapper.append(_infoAvator).append(_infoDet);
        _popupContent
          .prepend(_signWrapper)
          .prepend(_infoDetWrapper)
          .prepend(_infoText)
          .prepend(_closeIcon);
        _infoPopup.append(_masker).append(_popupContent);
        $("body").append(_infoPopup);
        _masker.on("click", function() {
          hide();
        });
        _closeIcon.on("click", function() {
          hide();
        });

        function hide() {
          _infoPopup.hide();
        }
      }

      return _infoPopup;
    };
  })();

  var AntiPlug = function() {
    // if (baseInfo.sign) {
    //   var editSign = editSign();
    // } else {
    // }
  };
  AntiPlug.prototype = {
    constructor: AntiPlug,
    show: function() {
      var baseInfo = Util.getSession(Util.baseInfo);
      var popup;
      if (!baseInfo.sign) {
        // $(".popup-edit-sign").show();
        popup = editSign();
      } else {
        // showinfoPopup(baseInfo);
        popup = infoPopup();
      }
      popup.show();
    }
  };

  if (typeof module != "undefined" && module.exports) {
    module.exports = AntiPlug;
  } else if (typeof define == "function" && define.amd) {
    define(function() {
      return AntiPlug;
    });
  } else {
    window.AntiPlug = AntiPlug;
  }
})(window.Zepto || window.jQuery, window.Util);
