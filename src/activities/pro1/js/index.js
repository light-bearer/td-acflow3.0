(function () {
    FastClick.attach(document.body);
    //do your thing.
    // return;
    var $cPhone = $('.container-phone'),
        $cVideo = $('.container-video'),
        $cHardware = $('.container-hardware'),
        $xmask = $('#masker_x');
    var transform = { x: 0.774875, y: 0.363635 },
        vVideo = { x: (1.5 - transform.x), y: 1 },
        transformH = { x: 2.61219, y: 2.61219 },
        vHardware = { x: (transformH.x - 1), y: (transformH.y - 1) };
    $(window).on('scroll', function (e) {
        var scrollTop = $(this).scrollTop();
        
        if (scrollTop <= 800) {
                // console.log(scrollStep)
                var x = transform.x + vVideo.x / 800 * scrollTop, y = transform.y + vVideo.y / 800 * scrollTop
                $cVideo.css({
                    "transform": "scale(" + (x >= 1.5 ? 1 : x) + "," + (y > 1 ? 1 : y) + ")"
                });
        }

        // 从第四步骤，手机壳变小
        if (scrollTop >= 400 && scrollTop <= 1200) {
            var _scrollTop = scrollTop - 400,
                hX = transformH.x - vHardware.x / 600 * _scrollTop,
                hY = transformH.y - vHardware.y / 600 * _scrollTop;
            $cHardware.css({
                "transform": "scale(" + (hX < 1 ? 1 : hX) + "," + (hY < 1 ? 1 : hY) + ")"
            });
        }

        if (scrollTop <= 1000) {
            $cPhone.css({
                "transform": "translate(0," + (scrollTop + 24 )+ "px)"
            })
        }
        var _scale = 1 + scrollTop/ 100;
        if( _scale <=7) {
            $xmask.css({
                "transform": "scale("+ _scale + "," + _scale + ")"
            });
        }
        
    })

})();
