$(function(){

  // should be one function
  var punkSection = $('.punk-section');
  var punkBgPosition = punkSection.css('background-position');
  punkBgHorPosition = punkBgPosition.split(' ');

  var androidSection = $('.android-section');
  var androidBgPosition = androidSection.css('background-position');
  androidBgHorPosition = androidBgPosition.split(' ');

  updatePage = function() {
    window.requestAnimationFrame(function() {
      var scrollTop     = $(window).scrollTop();

          punkOffset = $(punkSection).offset().top;
          punkDistance = (punkOffset - scrollTop);
          punkScrollAdjust = 0 - punkDistance / 5;

          androidOffset = $(androidSection).offset().top;
          androidDistance      = (androidOffset - scrollTop);
          androidScrollAdjust = 0 - androidDistance / 5;

      punkSection.css({
        'background-position':punkBgHorPosition[0]+punkScrollAdjust+'px'
      });

      androidSection.css({
        'background-position':androidBgHorPosition[0]+androidScrollAdjust+'px'
      });
      
    });
  };
  scrollIntervalID = setInterval(updatePage, 10);

  // video player
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