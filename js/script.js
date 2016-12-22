$( document ).ready( function () {

  var parameters = ( function ( src ) {
    var params = {}, qryStr = src.split( '?' )[ 1 ];
    if( qryStr ) {
      $.each( qryStr.split( '&' ), function ( i, p ) {
        var ps = p.replace( /\/$/, '' ).split( '=' );
        var k = ps[ 0 ].replace( /^\?/, '' );
        params[ k ] = ps[ 1 ] || true;
      });
    }
    return params;
  })( location.search );

  var x = 0;
  var y = 0;

  var auto;
  var auto_x = 0;
  var auto_y = 0;
  var auto_throttle;

  var s = parameters.s || 3;

//segnmentation
  var n = ~~parameters.n || 7;
  var tiles = '';
  if ( n ) {
    for ( var i = 0; i <= n * 2; i++ ) {
      tiles += [ '<div class="tile t', i, '"><div class="image"></div></div>' ].join( '' );
    }
  }

  var $kaleidescope = $( '.kaleidoscope' )
    .addClass( 'n' + n )
    .append( tiles );

  var $image = $kaleidescope.find( '.image' );

  var $fullscreen = $( '#fullscreen' );
  var k = $kaleidescope[ 0 ];

  // image tracker
  var src = parameters.src;
  if ( src ) {
    $image.css( 'background-image', [ 'url(',
    decodeURIComponent( src ), ')' ].join( '' ) );
  }

  // hides link in fullscreen
  var clean = parameters.clean;
  if ( clean ) {
    $( 'body' ).addClass('clean');
  }


  var opacity = parseFloat( parameters.opacity );
  if ( opacity ) {
    $kaleidescope.css('opacity', 0).fadeTo( 3000, opacity );
  }



  var mode = ~~parameters.mode || 2;

  $kaleidescope.click( function ( e ) {
    x++;
    y++;

    var nx = e.pageX, ny = e.pageY;
    switch ( mode ) {
      case 1:
        nx = -x;
        ny = e.pageY;
        break;
      case 2:
        nx = e.pageX;
        ny = -y;
        break;
      case 3:
        nx = x;
        ny = e.pageY;
        break;
      case 4:
        nx = e.pageX;
        ny = y;
        break;
      case 5:
        nx = x;
        ny = y;
        break;
    }

    move( nx, ny );
    auto = auto_throttle = false;
  });


  // full screen
  $fullscreen.click( function() {
    if ( document.fullscreenEnabled || document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ) {
      if ( k.requestFullscreen )       k.requestFullscreen();
      if ( k.mozRequestFullScreen )    k.mozRequestFullScreen();
      if ( k.webkitRequestFullscreen ) k.webkitRequestFullscreen();
    }
  });

  // Animation
  window.requestAnimFrame = ( function( window ) {
    var suffix = "equestAnimationFrame",
      rAF = [ "r", "webkitR", "mozR" ].filter( function( val ) {
        return val + suffix in window;
      })[ 0 ] + suffix;

    return window[ rAF ]  || function( callback ) {
      window.setTimeout( function() {
        callback( +new Date() );
      }, 1000 / 60 );
    };
  })( window );

  function animate() {
    var time = new Date().getTime() * [ '.0000', s ].join( '' );
    auto_x = Math.sin( time ) * document.body.clientWidth;
    auto_y++;

    move( auto_x, auto_y );
    if ( auto ) requestAnimFrame( animate );
  }

  function move( x, y ) {
    $image.css( 'background-position', [ x + "px", y + "px" ].
    join( ' ' ) );
  }

  // automatic start
  (function timer() {
      setTimeout( function() {
        timer();
        if( auto && !auto_throttle ) {
          animate();
          auto_throttle = true;
        } else {
          auto = true;
        }
      }, 0000 );
  })();
});

$(document).ready(function(){
  var kalos = document.getElementById('kalos');
kalos.addEventListener('drop', drop, false);


function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var imageUrl = evt.dataTransfer.getData('text/html');
    if($(imageUrl).children().length > 0 ){
        var url = $(imageUrl).find('img').attr('src');
    }else{
        var url = $(imageUrl).attr('src');
    }
    $('.image').css('background-image', 'url("' + url + '")');
    //alert(url);
}
});
