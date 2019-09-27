(function() {
    FastClick.attach(document.body);
    var openId = Util.getParam("openId"), // 登录后返回相关openid
    code = Util.getParam("code"); // 授权code

    var interval = null, 
        msgPager = {limit: Util.pager.limit, page: Util.pager.page},
        memberPager = {limit: Util.pager.limit, page: Util.pager.page},
        roomPager = {limit: Util.pager.limit, page: Util.pager.page},
        integalPager = {limit: Util.pager.limit, page: Util.pager.page};

    var groups = [],
        currentGroup = '',
        groupType = '1';
    
    var GETTING_MEMBERS = false; // 正在获取成员数据


  /** 主要初始化 */
    var baseInfo = Util.getSession(Util.baseInfo),
      token = Util.getSession(Util.token);
    if (!baseInfo ||  !token) {
        Util.auth(code, function(token) {
            Util.getUserInfo(function(data) {});
            // getListOfUser();
            initPage()
        });
    } 
    // 初始化页面
    initPage()
    // 1、进来第一步，调群组列表
    // getListOfUser();

    // $(".create-room-popup").show();
    $('.btn-groups').on('click', '.btn', function(e) {
        var $target = $(e.currentTarget),
        _btn = $target.attr('data-type');
        switch(_btn) {
            case 'gametype':
                eventGametype();
                break;
            case 'create':
                eventCreate()
                break;
            case 'msg': 
                eventMsg();
                break;
            case 'score':
                eventScore();
                break;
            case 'dismiss':
                eventDismiss();
                break;
            case 'member':
                eventMember();
                break;
            case 'found':
                eventFound();
                break;
            case 'cfdf':
                eventCFDF();
                break;
            case 'jfph': 
                eventJFPH();
                break;
                
        }
    });
    // 房间加载更多
    $('.content-main').on('click', '.loadmore', function(e) {
        roomPager.page += 1;
        getRoomListOfGroup();
    })
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

    // 创建或者加入俱乐部
    $('.room-groups').on('click', '#add', function(e) {
        $('.create-join-club').show();
    })
    // 点击群组
    $('.room-groups').on('click', '.room.my-info', function(e) {
        handleSelectGroup(e);
    });
    // 选择房间
    $('.room-groups').on('click', '.room.game, .room.normal', function(e) {
        handleSelectRoom(e);
    });
    // 加入游戏房
    $('.room-list').on('click', '.room .btn-join', function(e) {
        joinRoom(e);
    });
    // 弹窗创建俱乐部
    $('.create-join-club').on('click', '.btn-create-club', function(e) {
        // $('.popup-create-club').show();
        $('.create-join-club').hide();
        inputDialog({
            title: '../images/club/txt_create_club.png',
            placeholder: '输入俱乐部名字',
            cb: function(inputValue) {
                console.log(inputValue)
                createGroup(inputValue);
            }
        })
    });
    // 弹窗加入俱乐部
    $('.create-join-club').on('click', '.btn-join-club', function(e) {
        // $('.popup-create-club').show();
        $('.create-join-club').hide();
        inputDialog({
            title: '../images/club/txt_join_club.png',
            placeholder: '输入加入俱乐部ID',
            cb: function(inputValue) {
                joinGroup(inputValue);
            }
        })
    })

    $('.popup-wrapper').on("click", '.masker, .icon-close, .to-close', function() {
        $(".popup-wrapper").hide();
    });

    $(".btn-save").on("click", function(e) {
        createGameType();
      });
    // 审批消息
    $('.popup-msg').on('click', '.btn-approval', function(e) {
        var $target = $(e.currentTarget),
        userId = $target.attr('data-id'),
        state = $target.attr('data-state');
        approval(userId, state);
    })
    // 解散
    $('.popup-dismiss').on('click', '.btn-dismiss', function() {
        Util.popup({
            type: 'confirm',
            content: '确定要解散当前群吗？',
            negativeCb: function() {

            },
            positiveCb: function() {
                // todo dismiss
                // console.log('dismiss')
                updateGroup({
                    state: -1,
                }, function() {
                    $('.popup-dismiss').hide();
                    Util.toast('解散俱乐部成功', 1000);
                    setTimeout(function(e) {
                        window.location.reload();
                    }, 1000);
                    
                });
            }
        })
    });
    // 解散设置，保存俱乐部名称
    $('.popup-dismiss').on('click', '.btn-dismiss-save', function() {
        var _name = $('#input_club_name').val().trim();
        updateGroup({name: _name}, function() {
            $('#group_name').html(_name);
            Util.popup({
                type: 'alert',
                content: '修改成功',
                negativeCb: function() {
    
                }
            })
        });
    });
    // 解散设置，确定按钮
    $('.popup-dismiss').on('click', '.btn-confirm', function() {
        var createState = $('input[name="create_state"]:checked').val(),
            payState = $('input[name="pay_state"]:checked').val();
        updateGroup({
            createState: createState,
            payState: payState,
        }, function() {
            groups[currentGroup].createState = createState;
            groups[currentGroup].payState = payState;
            Util.popup({
                type: 'alert',
                content: '修改成功',
                negativeCb: function() {
    
                }
            })
        });
    });
    // 解散设置，退出群组
    $('.popup-dismiss').on('click', '.btn-quit', function() {
        quitGroup();
    });
    // 成员滚动加载更多
    // $('.member-list').scroll(function(e) {
    //     // console.log('scroll');
    //     handleScroll(e);
    // });
    // 成员点击加载更多
    $('.popup-members').on('click', '.loadmore', function(e) {
        memberPager.page += 1;
        getGroupUserList();
    })

    // 充值基金
    $('.popup-found').on('click', '.btn-found-recharge', function(e) {
        inputDialog({
            title: '../images/club/txt_score_change.png',
            placeholder: '请输入数字',
            width: '70%',
            cb: function(inputValue) {
                console.log(inputValue)
                if (!/^[1-9]\d*$/.test(inputValue)) {
                    Util.toast('请输入正整数');
                    return;
                }
                payIntegal(inputValue);
                // joinGroup(inputValue);
            }
        })
    });
    // 基金账单明细
    $('.popup-found').on('click', '.btn-found-detail', function(e) {
        if($('.popup-found-detail .list-main .row').length <= 0) {
            getIntegalDetail();
        }
        $('.popup-found-detail').show();
    })
    // 基金账单明细加载更多
    $('.popup-found-detail').on('click', '.loadmore', function(){
        integalPager.page += 1;
        getIntegalDetail();
    });
    function initPage() {
        getListOfUser(function() {
            // 获取房间列表
            getRoomListOfGroup();
            // 获取消息
            getListOfStateAndGroup();
        });
        // intervalGetMsg();
    }
      // 1、进来第一步，调群组列表接口group/getListOfUser
    function getListOfUser(cb) {
        Util.Ajax({
            url: Util.openAPI + "/app/group/getListOfUser",
            type: "get",
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                groups = data.data;
                currentGroup = 0;
                groupType = "1";
                roomPager.page = 1;
                $('.cfdf, .jfph, .sf').hide();
                // 编译地步房间模板
                var groupTemp = '';
                groups.forEach(function(group, index) {
                    groupTemp += '<div class="room my-info '+ (index === 0 ? 'active' : '') +'" id="creator" data-index="'+ index + '"> '
                    + '<div class="info-avator-wrapper">'
                    + '<img src="'+ group.createUserImg +'" alt="" id="creator_img">'
                    + '</div>'
                    + '<p id="creator_name">' + group.createUserNickName +'</p>'
                    + '<p class="grade" id="level">' + group.level +'</p>'
                    + '</div>';
                })

                groupTemp += '<div class="room normal active" data-value="1">'
                           + ' <i class="icon-roomcard"></i>'
                           + '</div>'
                           + '<div class="room game" data-value="2">'
                           + '<i class="icon-cup"></i>'
                           + '</div>';
                $('#room_scroll_wrapper').html(groupTemp);

                // 展示当前俱乐部名称和id
                $('#group_name').text(groups[currentGroup].name);
                $('#group_num').html(groups[currentGroup].groupNumber);
                cb && cb();

            } else {
                Util.toast("获取群组列表失败");
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("获取群组列表失败");
            }
        });
    }
    // 轮训获取消息
    // function intervalGetMsg() {
    //     interval = setInterval(function(){
    //         getListOfStateAndGroup()
    //     }, 2000);
    // }
    // 获取消息
    function getListOfStateAndGroup() {
        msgPager.page = msgPager.page < 1 ? 1: msgPager.page;
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/getListOfStateAndGroup",
            type: "get",
            dataType: "json",
            data: {
                limit: msgPager.limit,
                page: msgPager.page,
                state: 0,
                groupId: groups[currentGroup].id
            },
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    console.log(data.data)
                    // 如果有消息，那么关闭轮询，否则启动轮询
                    if (data.data.total > 0) {
                        $('.btn.msg').css({display: 'inline-block'});
                        clearInterval(interval);
                        interval = null;
                        // 编译消息模板
                        var _rows = data.data.rows, _temp = '';
                        for(let i = 0; i < _rows.length; i++) {
                            _temp += '<div class="msg-item">'
                            +'<div class="info-avator-wrapper"> <img src="'+ _rows[i].userImg + '"/></div>'
                            +'<div class="info"><span>'+ _rows[i].userNickName +'</span><span>ID:'+ _rows[i].userId +'</span></div>'
                            +'<div class="btns">'
                            +'<div class="btn-approval btn-shield" data-id="'+ _rows[i].userId + '" data-state="0"></div>'
                            +'<div class="btn-approval btn-reject" data-id="'+ _rows[i].userId + '" data-state="-1"></div>'
                            +'<div class="btn-approval btn-agree" data-id="'+ _rows[i].userId + '" data-state="1"></div>'
                            +'</div>'
                            +'</div>';
                        }
                        if(msgPager.page === 1) {
                            $('.msg-list').html('');
                        }
                        $('.msg-list').append(_temp);
                        if (msgPager.limit * msgPager.page >= data.data.total) {
                            $('.popup-msg').find('.nomore').show();
                            $('.popup-msg').find('.loadmore').hide();
                        } else {
                            $('.popup-msg').find('.nomore').hide();
                            $('.popup-msg').find('.loadmore').show();
                        }
                    } else {
                        $('.btn.msg').hide();
                        if (!interval) {
                            interval = setInterval(function(){
                                getListOfStateAndGroup()
                            }, 2000);
                        }
                    }
                } else {
                    msgPager.page -= 1;
                    Util.toast(data.msg);
                }
            },
            cbErr: function() {
                msgPager.page -= 1;
                Util.toast('消息查询失败，请稍后再试')
            }
        });
    }
    // 加入游戏房间
    function joinRoom(e) {
        var $target = $(e.currentTarget),
            roomId = $target.attr('data-roomid'),
            gameId = $target.attr('data-gameid')
        Util.Ajax({
            url: Util.openAPI + "/app/room/joinRoom",
            type: "post",
            dataType: "json",
            data: {
                id: roomId,
            },
            cbOk: function(data, textStatus, jqXHR) {
                if(data.code === 0) {
                    Util.toast('加入成功！');
                    // 加入成功，跳转到游戏页面（现在暂时直接跳转暗宝
                    setTimeout(function() {
                        window.location.href = "./gameAnBao.html?id=" + roomId;
                    }, 500)
                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function() {
                Util.toast('加入失败，请稍后再试！');
            }
        });
    }
    // 审批消息
    function approval(userId, state) {
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/action",
            type: "post",
            dataType: "json",
            data: {
                id: userId,
                state: state
            },
            cbOk: function(data, textStatus, jqXHR) {
                if(data.code === 0) {
                    Util.toast('审批成功');
                    msgPager.page = 1;
                    getListOfStateAndGroup();
                } else {
                    Util.toast(data.msg);
                }
            }
        });
    }
    // 2、创建俱乐部
    function createGroup(name) {
        name = name.trim();
        if (!name) {
            Util.toast('俱乐部名称不能为空!');
            return;
        }
        Util.Ajax({
            url: Util.openAPI + "/app/group/create",
            type: "post",
            dataType: "json",
            data: {
                name: name
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                $('.popup-create-club').hide();

                Util.popup({
                    type: 'alert',
                    content: '创建' + name + '群成功',
                    positiveCb: function() {
                        getListOfUser();
                    }
                })

            } else {
                Util.toast("创建俱乐部失败");
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("创建俱乐部失败");
            }
        });
    }
    // 加入俱乐部
    function joinGroup(groupId) {
        groupId = groupId.trim();
        if (!groupId) {
            Util.toast('俱乐部名称不能为空!');
            return;
        }
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/joinGroup",
            type: "post",
            dataType: "json",
            data: {
                id: groupId
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                $('.popup-create-club').hide();

                Util.popup({
                    type: 'alert',
                    content: data.msg,
                    positiveCb: function() {
                        getListOfUser();
                    }
                })

            } else {
                Util.toast("创建俱乐部失败");
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("创建俱乐部失败");
            }
        });
    }
    // 创建游戏类型
    function createGameType() {
        var roomParams = {
            chip: $('input[name="chips"]:checked').val(),
            chipLimit: $('input[name="chipLimits"]:checked').val(),
            people: $('input[name="peoples"]:checked').val(),
            betTime: $('input[name="betTimes"]:checked').val(),
            groupId: groups[currentGroup].id,
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
            url: Util.openAPI + "/app/groupRoomParams/saveAndOpen",
            type: "post",
            data: roomParams,
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
              // console.log(data);
              if (data.code === 0) {
                Util.popup({
                    type: 'alert',
                    content: '发布成功',
                    positiveCb: function() {
                        $('.create-room-popup').hide();
                    }
                });
              } else {
                Util.toast(data.msg);
              }
            },
            cbErr: function(e, xhr, type) {
              Util.toast("创建房间失败");
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
    // 解散设置，更新群组信息
    function updateGroup(options, cb) {
        var group = groups[currentGroup];
        var _options = {
            id: group.id,
            name: group.name,
            createState: group.createState,
            payState: group.payState,
            state: group.state
        };
        _options = $.extend(_options, options || {});
        Util.Ajax({
            url: Util.openAPI + "/app/group/update",
            type: "post",
            dataType: "json",
            data: _options,
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
               cb && cb();
            } else {
                Util.toast(data.msg);
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("设置失败！");
            }
        });
    }
    // 退出群组
    function quitGroup() {
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/cancel",
            type: "post",
            dataType: "json",
            data: {
                id: groups[currentGroup].id
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                Util.toast("退出成功！");
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            } else {
                Util.toast(data.msg);
            }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("退出失败，请稍后再试！");
            }
        });
    }
    // 充值基金
    function payIntegal(num) {
        Util.Ajax({
            url: Util.openAPI + "/app/group/pay",
            type: "post",
            dataType: "json",
            data: {
                id: groups[currentGroup].id,
                integal: num
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                Util.toast("充值成功！");
                var _integal = parseInt(groups[currentGroup].integal) + parseInt(num);
                groups[currentGroup].integal = _integal;
                $('.popup-found #integal').html(_integal);

            } else {
                Util.toast(data.msg);
            }
            },
            cbErr: function(e, xhr, type) {
            Util.toast("充值失败！");
            }
        });
    }
    // 基金，账单明细
    function getIntegalDetail() {
        var $detail = $('.popup-found-detail');
        integalPager.page = integalPager.page < 1 ? 1: integalPager.page
        Util.Ajax({
            url: Util.openAPI + "/app/integalDetail/getListOfGroup",
            type: "get",
            dataType: "json",
            data: {
                groupId: groups[currentGroup].id,
                limit: integalPager.limit,
                page: integalPager.page
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
                var _rows = data.data.row, _temp = '';
                for(var i = 0; i < _rows.length; i ++) {
                    _temp += '<div class="row tr"><div>' + _rows[i].type +'</div><div>'+ _rows[i].count +'</div><div>'+ _rows[i].nickName +'</div><div>' + _rows[i].createTime + '</div></div>';
                }
                integalPager.page === 1  && $('.room-list').html('');
                $detail.find('.list-main').append(_temp);
                if (integalPager.limit * integalPager.page >= data.data.total) {
                    $detail.find('.nomore').show();
                    $detail.find('.loadmore').hide();
                } else {
                    $detail.find('.nomore').hide();
                    $detail.find('.loadmore').show();
                }
            } else {
                Util.toast(data.msg);
                integalPager.page -= 1;
            }
            },
            cbErr: function(e, xhr, type) {
                integalPager.page -= 1;
                Util.toast("查询明细失败！");
            }
        });
    }
    // 获取房间列表
    function getRoomListOfGroup() {
        roomPager.page = roomPager.page < 1 ? 1 : roomPager.page;
        Util.Ajax({
            url: Util.openAPI + "/app/room/getListOfGroup",
            type: "get",
            dataType: "json",
            data: {
                limit: roomPager.limit,
                page: roomPager.page,
                groupId: groups[currentGroup].id,
                groupType: groupType
            },
            cbOk: function(data, textStatus, jqXHR) {
            // console.log(data);
            if (data.code === 0) {
               
                // console.log(data.data)
                var _data = data.data, _temp = '';
                for(var i = 0; i < _data.rows.length; i++) {
                    _temp += '<div class="room">'
                    + '<div class="top">'
                    + '<div class="info-avator-wrapper">'
                    + '<img src="'+  _data.rows[i].userImg +'" alt="" id="creator_img">'
                    + '</div>'
                    + '<div class="room-name">'+ (_data.rows[i].gameName || '')  +'/'+ _data.rows[i].type+'(房号:' + _data.rows[i].roomNumber + '）</div>'
                        + '<div class="room-count">'+ _data.rows[i].joinUserCount+'/'+ _data.rows[i].people+'</div>'
                        + '</div>'
                        + '<div class="bottom">'
                        + '<div class="row">'
                        + '<div class="col"><i class="icon-txt">分</i><span>'+ (_data.rows[i].winIntegal || '')+'</span></div>'
                        + '<div class="col"><i class="icon-txt">局</i><span>'+ _data.rows[i].numberOfOpen+'/'+ _data.rows[i].numberOfGame+'</span></div>'
                        + '</div>'
                        + '<div class="row">'
                        + '<div class="col font-24"><i class="icon-txt">规</i><span>'+ _data.rows[i].oddsString+'</span></div>'
                        + '</div>'
                        + '</div>'
                        + '<div class="btn-join" data-roomid="'+_data.rows[i].id +'" data-gameid="'+ _data.rows[i].gameId +'"></div>'
                        + '</div>';
                }
                roomPager.page === 1  && $('.room-list').html('');
                $('.room-list').append(_temp);
                if (roomPager.limit * roomPager.page >= data.data.total) {
                    $('.content-main').find('.nomore').show();
                    $('.content-main').find('.loadmore').hide();
                } else {
                    $('.content-main').find('.nomore').hide();
                    $('.content-main').find('.loadmore').show();
                }
            } else {
                Util.toast("获取房间列表失败");
                roomPager.page -= 1;
            }
            },
            cbErr: function(e, xhr, type) {
                roomPager.page -= 1;
                Util.toast("获取房间列表失败");
            }
        });
    }
    // 创建
    function eventCreate() {
        Util.Ajax({
            url: Util.openAPI + "/app/room/createRoomForGroup",
            type: "post",
            dataType: "json",
            data: {
                groupId: groups[currentGroup].id,
                groupType: groupType
            },
            cbOk: function(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.code === 0) {
                    Util.toast('创建房间成功！');
                    getRoomListOfGroup();

                } else {
                    Util.toast(data.msg);
                }
            },
            cbErr: function(e, xhr, type) {
                Util.toast("创建房间失败，请稍后再试");
            }
        });
    }

    // 消息
    function eventMsg() {
        $('.popup-msg').show();
    }

    function eventScore() {
        window.location.href = './record.html';
    }
    // 解散
    function eventDismiss() {
        console.log(groups[currentGroup]);
        console.log(baseInfo)
        var $dismiss = $('.popup-dismiss'),
            group = groups[currentGroup];
        $dismiss.find('#input_club_name').val(group.name);
        $("input[name='create_state'][value='"+group.createState+"']").prop("checked",true);
        $("input[name='pay_state'][value='"+group.payState+"']").prop("checked",true);
        // 如果是创建人
        if(baseInfo.id === group.createUserId) {
            $dismiss.addClass('creator')
            $dismiss.find('input').removeAttr("disabled")
        } else {
            $dismiss.removeClass('creator')
            $dismiss.find('input').attr("disabled","disabled")
            
        }

        $dismiss.show();
    }
    // 成员
    function eventMember() {
        getGroupUserList();
        $('.popup-members').show();
    }

    // 俱乐部基金
    function eventFound() {
        var _group = groups[currentGroup];
        $('.popup-found #payState').html(_group.payState == '1' ? '尚未开启': '已经开启');
        $('.popup-found #integal').html(_group.integal);
        $('.popup-found').show();
    }
    // 抽分调分
    function eventCFDF() {
        $('.popup-cfdf').show();
    }
    // 积分排行
    function eventJFPH() {
        var $panel = $('.jfph-panel'),
        status = $panel.attr('data-status');
        if (status === '0') {
            $panel.attr('data-status', 1);
            $panel.show();
            return;
        }
        $panel.attr('data-status', 0);
        $panel.hide();
    }
    // 选择群组
    function handleSelectGroup(e) {
        var $target = $(e.currentTarget),
            index = $target.attr('data-index');
        $('.my-info').removeClass('active');
        $target.addClass('active');
        currentGroup = index;
        $('#group_name').html(groups[currentGroup].name);
        $('#group_num').html(groups[currentGroup].groupNumber);

        // 默认选回第一间房
        groupType = "1";
        roomPager.page = 1;
        getRoomListOfGroup();
        $('.cfdf, .jfph, .sf').hide();
        $('.room.game, .room.normal').removeClass('active');
        $('.room.normal').addClass('active');
    }
    // 选择房间
    function handleSelectRoom(e) {
        var $target = $(e.currentTarget);
        if ($target.hasClass('active')) {
            return;
        }
        groupType = $target.attr('data-value');
        if(groupType == '1') {
            $('.cfdf, .jfph, .sf').hide();
        } else {
            $('.cfdf, .jfph, .sf').show();
        }
        roomPager.page = 1;
        $('.room.game, .room.normal').removeClass('active');
        $target.addClass('active');
        roomPager.page = 1;
        getRoomListOfGroup();
    }

    
    function getGroupUserList() {
        memberPager.page = memberPager.page < 1 ? 1: memberPager.page
        var $pmember = $('.popup-members');
        if(GETTING_MEMBERS) {
            return;
        }
        GETTING_MEMBERS = true;
        Util.Ajax({
            url: Util.openAPI + "/app/groupUser/getGroupUserList",
            type: "get",
            data: {
                limit: memberPager.limit,
                page: memberPager.page
            },
            dataType: "json",
            cbOk: function(data, textStatus, jqXHR) {
              // console.log(data);
              if (data.code === 0) {
                console.log(data)
                var _temp = '';
                if(memberPager.page === 1) {
                    $pmember.find('.list-scroll').html('');
                    }
                    $pmember.find('.list-scroll').append(_temp);
                    if (memberPager.limit * memberPager.page >= data.data.total) {
                        $pmember.find('.nomore').show();
                        $pmember.find('.loadmore').hide();
                    } else {
                        $pmember.find('.nomore').hide();
                        $pmember.find('.loadmore').show();
                    }
              } else {
                memberPager.page -= 1;
                Util.toast(data.msg);
              }
              GETTING_MEMBERS = false;
              
            },
            cbErr: function(e, xhr, type) {
              Util.toast("获取成员数据失败！");
              GETTING_MEMBERS = false;
              memberPager.page -= 1;
            }
        });
    }

    // 滚动加载更多成员
    function handleScroll(e) {
        var $target = $(e.currentTarget);
        var pageH = $target.find('.list-scroll').height();
        var scrollT = $target.scrollTop(); //滚动条top
        var winH = $target.height();
            var aa = (pageH - winH - scrollT) / winH;
            if (aa < 0.02) {//0.02是个参数
                getGroupUserList();
            }
    }
    /**
   * @func
   * @desc 带输入框弹窗
   * @param {options} options - 配置参数
   * @param {string} options.title - titleUrl，标题图片路径
   * @param {string} options.placeholder - 输入框提示语
   * @param {function} options.cb - 确定回调
   */
    function inputDialog(options) {
        var _options = {
            title: '',
            placeholder: '',
            cb: function () {},
          };
          _options = $.extend(_options, options || {});
          var popup_wrapper = $('<div/>')
              .addClass('popup-wrapper')
              .addClass('popup-input-dialog'),
            masker = $('<div/>').addClass('masker'),
            popup_content = $('<div/>').addClass('popup-content').addClass('content-bg'),
            icon_close = $('<i/>').addClass('icon-close'),
            title = $('<i/>').addClass('icon-title').css({
                'backgroundImage': 'url("'+ _options.title + '")'
            }),
            inputwrapper = $('<div/>').addClass('input-wrapper'),
            input = $('<input/>').addClass('common-input').attr('placeholder', _options.placeholder),

            btn = $('<div/>').addClass('btn-confirm-yellow');
            
            inputwrapper.append(input);

            if (_options.width) {
                popup_content.css({
                    width: _options.width
                });
            }
            popup_content.append(icon_close).append(title).append(inputwrapper).append(btn);
            popup_wrapper.append(masker).append(popup_content);
          
          $("body").append(popup_wrapper); // 事件绑定
          masker.bind("click", function(e) {
            hide(popup_wrapper);
          });
          icon_close.bind("click", function(e) {
            hide(popup_wrapper);
          });
          btn.on('click', function(e) {
            _options.cb && _options.cb(input.val());
            hide(popup_wrapper);
          });
          function hide(target) {
            target.remove();
          }
    }
})();