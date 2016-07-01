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


  $('.yt-player-autoload').each(function(){
      containerVideoID = $(this).attr('id');
      setTimeout(function(){
        loadYT(containerVideoID, 0);
      },500);
  });

});

function loadYT(id, autoplay) {
  //id is the videoID for YouTube as well as the ID for the container we are targeting
  embeddedPlayer = new YT.Player(id, {
      playerVars: { 'autoplay': autoplay, 'controls': 2,'autohide':1,'wmode':'opaque','rel':0 },
      videoId: id,
      events: {
          'onStateChange': embeddedOnPlayerStateChange
      }
  });
}

function embeddedOnPlayerStateChange(event) {
  switch (event.data){
    case YT.PlayerState.PLAYING:
        ga('send', 'event', 'Video', 'Play', 'RPA Video');
      break;
    case YT.PlayerState.ENDED:
        ga('send', 'event', 'Video', 'Complete', 'RPA Video');
      break;
  }
}