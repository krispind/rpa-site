$(function(){

  // should be one function
  var punkSection = $('.punk-section');
  var bgPosition = punkSection.css('background-position');
  bgHorPosition = bgPosition.split(' ');
  updatePage = function() {
    window.requestAnimationFrame(function() {
      var scrollTop     = $(window).scrollTop(),
          elementOffset = $(punkSection).offset().top,
          distance      = (elementOffset - scrollTop);
      var scrollAdjust = 0 - distance / 5;
      punkSection.css({
        'background-position':bgHorPosition[0]+scrollAdjust+'px'
      });
    });
  };
  scrollIntervalID = setInterval(updatePage, 10);

  var androidSection = $('.android-section');
  var bgPosition = androidSection.css('background-position');
  bgHorPosition = bgPosition.split(' ');
  updatePage = function() {
    window.requestAnimationFrame(function() {
      var scrollTop     = $(window).scrollTop(),
          elementOffset = $(androidSection).offset().top,
          distance      = (elementOffset - scrollTop);
      var scrollAdjust = 0 - distance / 5;
      androidSection.css({
        'background-position':bgHorPosition[0]+scrollAdjust+'px'
      });
    });
  };
  scrollIntervalID = setInterval(updatePage, 10);

});