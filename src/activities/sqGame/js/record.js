(function() {
  FastClick.attach(document.body);
  $("#back").on("click", function() {
    history.back();
  });
  $(".mc-btn-wrapper").on("click", "a", function() {
    $(this)
      .parent()
      .find("a")
      .removeClass("active");
    $(this).addClass("active");
  });
})();
