$(function(){

  var parallaxBackground = $('.parallax');
  var bgPosition = parallaxBackground.css('background-position');
  bgHorPosition = bgPosition.split(' ');
  updatePage = function() {
    window.requestAnimationFrame(function() {
      var windowScroll = $(window).scrollTop();
      var scrollAdjust = windowScroll / 2;
      parallaxBackground.css({
        'background-position':bgHorPosition[0]+scrollAdjust+'px'
      });
    });
  };
  scrollIntervalID = setInterval(updatePage, 10);

});