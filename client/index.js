/**
 * TO DO- > Fix artist name on audio bar -> when switching to another artist
 * Spacing on audio bar
 * Fix above n beyond album search issue
 */

/**
 * Handlebar template function
 * @param  {object} obj              [object of data to render]
 * @param  {string} templateSelector [DOM location to select template and to render to]
 */
function populateTemplate(obj, templateSelector) {
  // Grabs template script
  const theTemplateScript = $(`#${templateSelector}-template`).html();
  // Then compiles template
  const theTemplate = Handlebars.compile(theTemplateScript);
  // Then passes data to template
  const theCompiledHtml = theTemplate(obj);
  // Then adds compiled html to the page
  $(`.${templateSelector}-placeholder`).html(theCompiledHtml);
}

/**
 * Add and remove classes to render artist profile page correctly
 * @param  {string} artistImg [url of artist image]
 */
function adjustCss(artistImg) {
  $('body').addClass('make-relative');
  $('.artist-profile-img').css('background-image', `url("${artistImg}")`);
  $('nav').removeClass('hide-this');
  $('.related-artist-container').removeClass('hide-this');
  $('.audio-bar').removeClass('hide-this');
  $('.footer-bar').removeClass('footer-position');
  $('.related-artist-header').removeClass('hide-this');
  $('.album-list-outer').addClass('album-list-container');
}

/**
 * Make a GET request to server to spotify api to grab artist information
 * Then render artist info using handlebars.js template
 * Then send artistObj to next step in promise
 * @param  {string} artist  [artist name from input value]
 * @param  {function} resolve [resolves promise and sends artistObj to then()]
 * @param  {function} reject  [rejects promoise]
 * @param  {string}   artistId [artistId of artist if triggered from clicking on related artist
 *                             , otherwise artistId is 'none' if getArtist is invoked by search]
 */
function getArtist(artist, resolve, reject, artistId) {
  $.get('/artist', { artist, artistId }, (artistResults) => {
    // Error handling, if no artist results, early return
    if (artistResults === 'error') {
      console.log('ERROR in getArtist function, not getting data from api');
      reject();
      return;
    }
    // Scroll to top of page if no errors
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    // artistResults is in different format depending on route
    const parsedArtistObj = artistId === 'none' ? JSON.parse(artistResults).artists.items[0]
                                                : JSON.parse(artistResults);
    if (parsedArtistObj) {
      const artistObj = {};
      // If there is no artist image, assign it a default artist image
      artistObj.artistImg = !parsedArtistObj.images[1] ? 'http://www.offaehrte.de/gfx/team/maske.jpg' : parsedArtistObj.images[1].url;
      artistObj.artistName = parsedArtistObj.name;
      artistObj.artistId = parsedArtistObj.id;
      populateTemplate(artistObj, 'artist-profile');
      adjustCss(artistObj.artistImg);
      resolve(artistObj);
    } else {
      reject();
    }
  });
}

/**
 * Make a GET request to server to spotify api to grab popular songs
 * Then render tracklist using handlebars.js template
 * @param  {string} artistId              [id of artist]
 */
function getPopularTracks(artistId) {
  $.get('/tracks', { artistId }, (trackResults) => {
    const trackList = JSON.parse(trackResults).tracks.map((track) => {
      const trackArtists = track.artists.reduce((artistArr, artist, index) => {
        const artistName = index === track.artists.length - 1 ? artist.name : `${artist.name},`;
        artistArr.push({ artistName, artistId: artist.id });
        return artistArr;
      }, []);
      return { trackName: track.name, trackPreview: track.preview_url, trackArtists };
    });
    populateTemplate({ trackList, albumName: 'Popular' }, 'track-list');
  });
}

/**
 * If artist has less than 8 albums, iterate through albums and add again to array
 * @param  {array} coverArtUrls [array of album art urls]
 */
function displayCoverArt(coverArtUrls) {
  let i = 0;
  while (coverArtUrls.length < 8) {
    if (!coverArtUrls[i]) {
      i = 0;
    }
    coverArtUrls.push(coverArtUrls[i]);
    i += 1;
  }
  const finalCoverArtUrls = coverArtUrls.slice(0, 8).join(', ');
  $('.cover-art-background').css('background-image', `linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.8)),${finalCoverArtUrls}`);
}

/**
 * Make a GET request to server to spotify api to grab artist's albums
 * Then render album list using handlebars.js template
 * @param  {string} rawArtistName [name of artist]
 * @param  {string} artistId   [id of artist]
 * @param  {boolean} firstTry  [boolean for whether it is first attempt to grab album data]
 */
function getAlbums(artistName, artistId) {
  $.get('/albums', { artistName, artistId }, (albumResults) => {
      // If API request fails, log an error message
    if (albumResults === 'error') {
      console.log('Error getting albums');
      return;
    }
    const coverArtUrls = [];
    const albumObj = [];
    const parsedAlbumResults = JSON.parse(albumResults).albums.items;
    parsedAlbumResults.forEach((album) => {
      // Skip over albums that do not have artist listed in artist array
      for (let i = 0; i < album.artists.length; i += 1) {
        if (album.artists[0].name !== artistName) {
          return;
        }
      }
      // If there is no albumImgUrl, assign a default imgUrl
      const albumImg = album.images.length > 1 ? album.images[1].url : 'https://i.scdn.co/image/907e87639091f8805c48681d9e7f144dedf53741';
      coverArtUrls.push(`url('${albumImg}')`);
      albumObj.push({ albumImg, albumId: album.id, albumName: album.name.replace(/\s/g, 'unique.combo.of.words') });
    });
    displayCoverArt(coverArtUrls);
    // Pass artistId to be stored in data attribute,
    // to be used in api call to grab album tracks later
    populateTemplate({ albumObj, artistId }, 'album-list');
    $('.popular-album-image').addClass('active-album');
  });
}

/**
 * Make a GET request to server to spotify api to grab albums' tracks
 * Then render tracklist using handlebars.js template
 * @param  {string} albumId [id of album]
 * @param  {string} albumName   [name of album]
 */
function getAlbumTracks(albumId, albumName) {
  $.get('/albumTracks', { albumId }, (albumTrackResults) => {
    const trackList = JSON.parse(albumTrackResults).items.map((track) => {
      // Create array of artists for each track and add commas between each one
      const trackArtists = track.artists.reduce((artistArr, artist, index) => {
        const artistName = index === track.artists.length - 1 ? artist.name : `${artist.name},`;
        artistArr.push({ artistName, artistId: artist.id });
        return artistArr;
      }, []);
      return { trackName: track.name, trackPreview: track.preview_url, trackArtists };
    });
    populateTemplate({ trackList, albumName }, 'track-list');
  });
}

/**
 * Make a GET request to server to spotify api to grab related artists
 * Then render tracklist using handlebars.js template
 * @param  {string} artistId              [id of artist]
 */
function getRelatedArtists(artistId) {
  $.get('/relatedArtists', { artistId }, (artistResults) => {
    const relatedArtists = JSON.parse(artistResults).artists.map((artist) => {
      // If there is no artistImg, assign a default imgUrl
      const artistImg = artist.images.length > 1 ? `background-image:url(${artist.images[1].url})`
                                                 : 'background-image:url(https://i.scdn.co/image/907e87639091f8805c48681d9e7f144dedf53741)';
      return { artistId: artist.id, artistName: artist.name, artistImg };
    });
    populateTemplate({ relatedArtists }, 'related-artists');
  });
}

/**
 * Adds bootstrap classes depending if artist search was success or fail
 * @param  {keyword} context [keyword 'this' passed in]
 * @param  {boolean} success [if artist search was success or failure]
 */
function formValidation(context, success) {
  if (success) {
    // $(context).find('input').removeClass('form-control-danger');
    $(context).removeClass('has-danger');
    // Adds class that displays error icon
    // $(context).find('input').addClass('form-control-success');
    $(context).addClass('has-success');
  } else {
    // $(context).find('input').removeClass('form-control-success');
    $(context).removeClass('has-success');
    // $(context).find('input').addClass('form-control-danger');
    $(context).addClass('has-danger');
  }
}

/**
 * Completes all the api requests to load a new artist page
 * @param  {string} artist [artist name]
 * @param  {keyword} context [dom element the load new artist was triggered at]
 * @param  {string} artistId [artist Id, is 'none' if function is ran from search input]
 */
function loadNewArtist(artist, context, artistId = 'none') {
  new Promise((resolve, reject) => {
    getArtist(artist, resolve, reject, artistId);
  }).then((artistObj) => {
    formValidation(context, true);
    getPopularTracks(artistObj.artistId);
    getAlbums(artistObj.artistName, artistObj.artistId);
    getRelatedArtists(artistObj.artistId);
  }).catch(() => {
    formValidation(context, false);
  });
}

/**
* On submit form, get data from spotify API and render to page using handlebar templates
* Cannot be an arrow function because of the 'this' binding
*/
$('.search-form').submit(function (event) {
  event.preventDefault();
  $(this).find('input').blur();
  const artist = $(this).find('input').val();
  loadNewArtist(artist, this);
});

/**
 * Clears search form when x is clicked
 */
$('.search-clear').click(() => $('.form-control').val('').focus());

/**
 * On other-artist click, load new artist page
 */
$('.track-list-placeholder').on('click', '.other-artist', function () {
  const artist = $(this).text();
  const artistId = $(this).data('artist-id');
  loadNewArtist(artist, this, artistId);
});

/**
 * When related artist card is clicked, load new artist with its artist ID
 * Cannot be an arrow function because of the 'this' binding
 */
$('.related-artists-placeholder').on('click', '.card', function (e) {
  const artist = $(this).find('.card-text').text();
  const artistId = $(this).find('.card-text').data('artist-id');
  loadNewArtist(artist, this, artistId);
});


/**
 * Changes tracklist when an album art is clicked
 * Cannot be an arrow function because of the 'this' binding
 */
$('.album-list-placeholder').on('click', 'img', function () {
  $('.active-album').removeClass('active-album');
  $(this).addClass('active-album');
  const albumId = $(this).data('album-id');
  const albumName = $(this).data('album-name').replace(/(unique.combo.of.words)/g, ' ');
  if (albumId === 'popularSongs') {
    const artistId = $(this).data('artist-id');
    getPopularTracks(artistId);
  } else {
    getAlbumTracks(albumId, albumName);
  }
});

/**
 * Self invoking function sets up storage for audioObject so it doesn't need to be a global variable
 * @return {Object} [set and get methods to keep _audioObject as non-global variable]
 */
const currentAudio = (function () {
  let _audioObject = null;
  return {
    set: (newAudioObj) => {
      _audioObject = newAudioObj;
    },
    get: () => _audioObject,
  };
}());

/**
 * Play song at context DOM element,
 * Add and remove classes to make song highlighted/ have border,
 * And to display Play or Pause button depending if song is playing
 * And to display current song and artists on audio bar
 * Recursively play next song
 * @param  {keyword} context [dom element to play song]
 */
function playSong(context) {
  // Set up audioObject for song to be played
  const previewUrl = $(context).data('track-preview');
  // If there is an error, make the song element red
  if (!previewUrl) {
    $(context).addClass('list-group-item-danger has-danger');
    return;
  }
  const audioObject = new Audio(previewUrl);
  currentAudio.set(audioObject);
  audioObject.play();
  const artists = $(context).find('.other-artist').text();
  const songName = $(context).find('.song-name').text();
  $('.artist-name-audio-bar').html(`<h8 class="audio-bar-text">${artists}</h8>`)
  $('.song-name-audio-bar').html(`<h8 class="audio-bar-text">${songName}</h8>`)
  $(context).removeClass('selected');
  $(context).addClass('playing');
  audioObject.addEventListener('ended', () => {
    $('.play-pause').addClass('fa-play-circle-o');
    $('.play-pause').removeClass('fa-pause-circle-o');
    $(context).removeClass('playing');
    $(context).removeClass('selected');
    playSong($(context).next());
  });
  audioObject.addEventListener('pause', () => {
    $('.play-pause').addClass('fa-play-circle-o');
    $('.play-pause').removeClass('fa-pause-circle-o');
    $(context).removeClass('playing');
    $(context).addClass('selected');
  });
  audioObject.addEventListener('play', () => {
    $('.play-pause').addClass('fa-pause-circle-o');
    $('.play-pause').removeClass('fa-play-circle-o');
    $('.selected').removeClass('selected');
    $(context).addClass('playing');
  });
}

/**
 * Plays song when clicked
 * Cannot be an arrow function because of the 'this' binding
 */
$('.track-list-placeholder').on('click', 'li', function (e) {
  // Early return if clicked on other-artist
  if (e.target !== this) {
    return;
  }
  const audioObject = currentAudio.get();
  // If this song is playing, pause it
  if ($(this).hasClass('playing')) {
    audioObject.pause();
  } else {
    // If there is currently an audio object, pause it
    if (audioObject) {
      audioObject.pause();
    }
    playSong(this);
  }
});
/**
 * Plays or pause song
 * If no song is currently selected, play first song on album
 * Cannot be an arrow function because of the 'this' binding
 */
$('.play-pause').on('click', function () {
  const audioObject = currentAudio.get();
  if ($(this).hasClass('fa-play-circle-o')) {
    if (!$('.selected').hasClass('selected')) {
      const firstSong = $('.list-group-item:first-child');
      playSong(firstSong)
      return;
    }
    audioObject.play();
  } else {
    audioObject.pause();
  }
});
/**
 * Plays next song
 */
$('.fa-step-forward').on('click', () => {
  const nextSong = $('.selected, .playing').next();
  const audioObject = currentAudio.get();
  audioObject.pause();
  playSong(nextSong);
})

/**
 * Plays previous song
 */
$('.fa-step-backward').on('click', () => {
  const previousSong = $('.selected, .playing').prev();
  const audioObject = currentAudio.get();
  audioObject.pause();
  playSong(previousSong);
})

/**
 * Scroll listener to make audio bar stick to footer
 * just before it collides
 */
$(window).scroll(() => {
  const scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
  if (scrollBottom < 29) {
    $('.audio-bar').addClass('scroll-spy-position');
  } else {
    $('.audio-bar').removeClass('scroll-spy-position');
  }
});
