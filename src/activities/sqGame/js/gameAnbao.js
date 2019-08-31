(function() {
  FastClick.attach(document.body);

  // 位置模式
  var SEAT_MODE10 = [],
      SEAT_MODE13 = [],
      SEAT_MODE16 = [],
      SEAT_MODE20 = [],
      SEAT_MODE30 = [];

  $('.an-game-content').on('click', '.item', function(e) {
    var $target = $(e.currentTarget),
    type = $target.attr('data-type'),
    value = $target.attr('data-value');
    console.log(type + ': ' + value)
  })
})();
