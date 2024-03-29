'use strick';

(function(global) {
    var openAPI = "http://www.lanyuanoss.com";

    /**
     * @func
     * @desc getCookie - 获取cookie
     * @param {string} name - 对应的key，必填
     */
    function getCookie(name) {
        var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
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
    function setParam(param,value){
        var query = location.search.substring(1);
        var p = new RegExp("(^|&"+param+")=[^&]*");
        if(p.test(query)){
            query = query.replace(p,"$1="+value);
            location.search = '?'+query;
        }else{
            if(query == ''){
                location.search = '?'+param+'='+value;
            }else{
                location.search = '?'+query+'&'+param+'='+value;
            }
        }    
    }

    
    /**
     * @func
     * @desc toast - 冒泡提示
     * @param {string} msg - 提示信息，必填
     * @param {string} [duration] - 停留时间，选填， 默认1500ms
     */
    function toast(msg, duration) {
        var _toast = $('<div/>').addClass('toast'),
            _msg = $('<span/>').html(msg);
        _toast.append(_msg);
        $('body').append(_toast);
        setTimeout(function() {
            _toast.remove();
        }, duration || 1500);
    }
    
    /**
     * @func
     * @desc showLoader - 显示loading
     */
    function showLoader() {
        var temp = '<div class="loader-wrapper"><svg class="spinner show" viewBox="0 0 44 44"><circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle> </svg></div>',
            $loader = $('.loader-wrapper');
        if ($loader.length > 0) {
            $loader.show();
        } else {
            $('body').append(temp);
        }
    }
    
    /**
     * @func
     * @desc hideLoader - 隐藏loading
     */
    function hideLoader() {
        $('.loader-wrapper').hide();
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
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            beforeSend: function(xhr, settings) {
                if(loader) {
                    showLoader();
                }
                config.beforeSend && config.beforeSend(xhr, settings);

            },
            success: function(data, textStatus, jqXHR) {
                config.cbOk && config.cbOk(data, textStatus, jqXHR);
            },
            error: function(e, xhr, type) {
                config.cbErr && config.cbErr(e, xhr, type);
            },
            complete: function(xhr, status) {
                if(loader) {
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
            var _options = {
                title: '',
                content: '',
                btns: [{
                    name: '',
                    cb: function() {}
                }, {
                    name: '',
                    cb: function() {}
                }]
            };
            _options = $.extend(_options, options || {});
            var dialog_component = $('<div/>').addClass('popup').addClass('component-dialog'),
                masker = $('<div/>').addClass('masker'),
                dialog_wrapper = $('<div/>').addClass('pop-wrapper'),
                dialog_title = _options.title ? $('<div/>').addClass('pop-title').html(_options.title) : '',
                dialog_content = $('<div/>').addClass('pop-content').html(_options.content),
                btns = $('<div/>').addClass('btns'),
                _btn_temp = '';
            dialog_wrapper.append(dialog_title).append(dialog_content);
            for (var i = 0; i < _options.btns.length; i ++) {
                _btn_temp += '<button>' + _options.btns[i].name + '</button>';
            }
            btns.html(_btn_temp);
            dialog_wrapper.append(btns);
            dialog_component.append(masker).append(dialog_wrapper);
            $('body').append(dialog_component);
            // 事件绑定
            masker.bind('click', function(e) {
                hide(dialog_component);
            });
            btns.on('click', 'button', function(e) {
                var $target = $(e.currentTarget);
                var cb = _options.btns[$target.index()].cb;
                cb && cb.call(this, arguments);
                hide(dialog_component);
            });
            function hide(target) {
                target.remove();
            }
        }

    
    var Util = {
        openAPI: openAPI,
        getCookie: getCookie,
        getParam: getParam,
        setParam: setParam,
        toast: toast,
        showLoader: showLoader,
        hideLoader: hideLoader,
        Ajax: Ajax,
        popup: popup
    }
    global.Util = Util;
})(window)




