(function() {
  FastClick.attach(document.body);
  $(".back").on("click", () => {
    history.back();
  });
})();
