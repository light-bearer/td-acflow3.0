(function() {
    FastClick.attach(document.body);
    var openId = Util.getParam("openId"), // 登录后返回相关openid
    code = Util.getParam("code"); // 授权code

  /** 主要初始化 */
    var baseInfo = Util.getSession(Util.baseInfo),
      token = Util.getSession(Util.token);
    if (!baseInfo ||  !token) {
        Util.auth(code, function(token) {
            Util.getUserInfo(function(data) {});
            getListOfUser();
        });
    } 
    // 1、进来第一步，调群组列表
    getListOfUser();

    // $(".create-room-popup").show();
    $('.btn-groups').on('click', '.btn', function(e) {
        var $target = $(e.currentTarget),
        _btn = $target.attr('data-type');
        switch(_btn) {
            case 'gametype':
                eventGametype();
                break;
            case 'create':
                eventCreate();
                break;
            case 'score':
                eventScore();
                break;
        }
    });

     // 游戏类型设置切换庄家
     $(".create-room-popup .btns-wapper").on("click", "i", function(e) {
        var target = $(this);
        target.siblings().removeClass("active");
        target.addClass("active");
      });

    // 游戏类型设置，选择游戏
    $('.create-room-popup').on('click', '#game_select', function(e) {
        $('.game-list').removeClass('hidden');
        $('#game_hide').removeClass('hidden');
    });

    $('.create-room-popup').on('click', '#game_hide', function(e) {
        $('.game-list').addClass('hidden');
        $('#game_hide').addClass('hidden');
    });
    $('.game-list-scroll').on('click', '.game-list-item', function(e) {
        var $target = $(e.currentTarget);
            _id = $target.attr('data-id');
        if ($target.hasClass('active')) {
            return;
        }
        $('.game-list-item').removeClass('active');
        $target.addClass('active');
        Util.getParamsOfGame(_id, function(temp) {
            $(".cr-content").html(temp);
        });
    });

    

    $('.popup-wrapper').on("click", '.masker, .icon-close, .to-close', function() {
        $(".popup-wrapper").hide();
    });

    $(".btn-save").on("click", function(e) {
        // location.href = "./gameAnbao.html";
        // return;
        var roomParams = {
          chip: $('input[name="chips"]:checked').val(),
          chipLimit: $('input[name="chipLimits"]:checked').val(),
          people: $('input[name="peoples"]:checked').val(),
          betTime: $('input[name="betTimes"]:checked').val(),
          gameId: $('.game-list-item.active').attr('data-id'),
          playOdds: "",
          type: $(".btns-wapper")
            .find(".active")
            .eq(0)
            .attr("data-type")
        };
        var $playOddsEle = $(".playOdds:checked"),
          gameNumberRoomCard = $(
            'input[name="gameNumberOfGameList"]:checked'
          ).val();
        if (gameNumberRoomCard) {
          var arr = gameNumberRoomCard.split(",");
          roomParams.numberOfGame = arr[0];
          roomParams.roomCard = arr[1];
        }
        if ($playOddsEle) {
          var playOdds = [];
          // playOdds = {};
          for (var i = 0, eleLength = $playOddsEle.length; i < eleLength; i++) {
            // console.info("elem--", $playOddsEle.eq(i));
            var idOdds = $playOddsEle
              .eq(i)
              .val()
              .split(",");
  
            playOdds.push(
              JSON.stringify({
                gamePlayId: parseInt(idOdds[0]),
                odds: parseFloat(idOdds[1])
              })
            );
            // playOdds[idOdds[0]] = idOdds[1];
          }
          // roomParams.playOdds = playOdds;
          // roomParams.playOdds = JSON.stringify(playOdds);
          roomParams.playOdds = "[" + playOdds.join(",") + "]";
        }
        // console.info("roomParams---", roomParams);
        Util.Ajax({
          url: Util.openAPI + "/app/room/createRoom",
          type: "post",
          data: roomParams,
          dataType: "json",
          cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
              // Util.setSession("roomParams", data.data);
              var id = data.data.id;
              location.href = "./gameAnbao.html?id=" + id;
            } else {
              Util.toast(data.msg);
            }
          },
          cbErr: function(e, xhr, type) {
            Util.toast("创建房间失败");
          }
        });
      });

      // 1、进来第一步，调群组列表接口group/getListOfUser
    function getListOfUser() {
        Util.Ajax({
            url: Util.openAPI + "/app/group/getListOfUser",
            type: "get",
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                var _rooms = data.data;
                // 编译地步房间模板
                var roomTemp = '<div class="room my-info" id="creator"> '
                    + '<div class="info-avator-wrapper">'
                    + '<img src="'+ _rooms[0].createUserImg +'" alt="" id="creator_img">'
                    + '</div>'
                    + '<p id="creator_name">' + _rooms[0].createUserNickName +'</p>'
                    + '<p class="grade" id="level">' + _rooms[0].level +'</p>'
                    + '</div>'

            } else {
                Util.toast("获取群组列表失败");
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("获取群组列表失败");
            }
        });
    }
    // 游戏类型
    function eventGametype() {
        getGameList(function(games) {
            Util.getParamsOfGame(games[0].id, function(temp) {
                $(".cr-content").html(temp);
            });
            $(".create-room-popup").show();
        });
    }
    //获取游戏列表
    function getGameList(cb) {
        Util.Ajax({
            url: Util.openAPI + "/app/game/getGameList",
            type: "get",
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                var temp = "";
                data.data &&
                data.data.forEach(function(item, index) {
                    temp += '<div data-id="'+ item.id +'" class="game-list-item ' + (index === 0 ? 'active': '') +'">'+ item.name+'</div>'
                });
                $(".game-list-scroll").html(temp);
                console.log(data.data)
                cb && cb(data.data);
            } else {
                Util.toast("获取游戏列表失败");
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("获取游戏列表失败");
            }
        });
    }

    function eventScore() {
        window.location.href = './record.html';
    }
})();