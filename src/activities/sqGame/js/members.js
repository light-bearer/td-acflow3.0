(function() {
  FastClick.attach(document.body);

  $(".members-list").on("click", ".btn-member", function() {
    var $target = $(this);
    if ($target.hasClass("active")) {
      $target.removeClass("active");
    } else {
      $target.addClass("active");
    }
  });

  $(".btn-search").on("click", function() {
    var value = $(".m-search-input").val();
  });
})();
