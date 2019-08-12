(function() {
  FastClick.attach(document.body);
  //1-邀请成员发出； 2-邀请加入；3加入申请
  var state = 1;
  function init() {
    $(".main-content").attr("data-state", state);
  }
  init();
  $(".icon-close").on("click", function() {
    location.href = "./index.html";
  });
})();
