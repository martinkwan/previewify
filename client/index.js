/**
 * Handlebar template function
 * Grabs template script
 * Then compiles template
 * Then passes data to template
 * Then adds compiled html to the page
 * @param  {object} obj              [object of data to render]
 * @param  {string} templateSelector [DOM location to select template and to render to]
 */
function populateTemplate(obj, templateSelector) {
  const theTemplateScript = $(`#${templateSelector}-template`).html();
  const theTemplate = Handlebars.compile(theTemplateScript);
  const theCompiledHtml = theTemplate(obj);
  $(`.${templateSelector}-placeholder`).html(theCompiledHtml);
}

/**
 * Make a GET request to server to spotify api to grab artist information
 * Then render artist info using handlebars.js template
 * Then send artistObj to next step in promise
 * @param  {string} artist  [artist name from input value]
 * @param  {function} resolve [resolves promise and sends artistObj to then()]
 */
function getArtist(artist, resolve, reject) {
  $.get('/artist', { artist }, (artistResults) => {
    let artistObj = JSON.parse(artistResults).artists.items[0];
    if (artistObj) {
      artistObj = {
        artistName: artistObj.name,
        artistImg: artistObj.images[2].url,
        artistId: artistObj.id,
      };
      populateTemplate(artistObj, 'artist-profile');
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
function getTracks(artistId) {
  $.get('/tracks', { artistId }, (trackResults) => {
    const trackList = JSON.parse(trackResults).tracks.map(track => track.name);
    populateTemplate({ trackList, albumName: 'Popular' }, 'track-list');
  });
}

/**
 * Make a GET request to server to spotify api to grab artist's albums
 * Then render album list using handlebars.js template
 * @param  {string} artistName [name of artist]
 * @param  {string} artistId   [id of artist]
 */
function getAlbums(artistName, artistId) {
  $.get('/albums', { artistName }, (albumResults) => {
    const coverArtUrl = JSON.parse(albumResults).albums.items.map(album => album.images[1].url);
    const albumObj = JSON.parse(albumResults).albums.items.map((album) => {
      return { albumImg: album.images[1].url, albumId: album.id, albumName: album.name.replace(/\s/g, 'unique.combo.of.words') };
    });
    let i = 0;
    while (coverArtUrl.length < 8) {
      if (!coverArtUrl[i]) {
        i = 0;
      }
      coverArtUrl.push(coverArtUrl[i]);
      i += 1;
    }
    $('.cover-art-background').css('background-image', `url('${coverArtUrl[0]}'), url('${coverArtUrl[1]}'), url('${coverArtUrl[2]}'), url('${coverArtUrl[3]}'), url('${coverArtUrl[4]}'), url('${coverArtUrl[5]}'), url('${coverArtUrl[6]}'), url('${coverArtUrl[7]}')`);
    populateTemplate({ albumObj, artistId }, 'album-list');
  });
}

/**
 * Make a GET request to server to spotify api to grab albums' tracks
 * Then render tracklist using handlebars.js template
 * @param  {string} artistId [id of artist]
 * @param  {string} albumName   [name of album]
 */
function getAlbumTracks(albumId, albumName) {
  $.get('/albumTracks', { albumId }, (albumTrackResults) => {
    const trackList = JSON.parse(albumTrackResults).items.map(track => track.name);
    populateTemplate({ trackList, albumName }, 'track-list');
  });
}

/**
 * Adds bootstrap classes depending if artist search was success or fail
 * @param  {keyword} context [keyword 'this' passed in]
 * @param  {boolean} success [if artist search was success or failure]
 */
function formValidation(context, success) {
  if (success) {
    $(context).find('input').removeClass('form-control-danger');
    $(context).removeClass('has-danger');
    $(context).find('input').addClass('form-control-success');
    $(context).addClass('has-success');
  } else {
    $(context).find('input').removeClass('form-control-success');
    $(context).removeClass('has-success');
    $(context).find('input').addClass('form-control-danger');
    $(context).addClass('has-danger');
  }
}

/**
* On submit form, get data from spotify API and render to page using handlebar templates
* Cannot be an arrow function because of the 'this' binding
*/
$('.search-form').submit(function (event) {
  event.preventDefault();
  const artist = $(this).find('input').val();
  new Promise((resolve, reject) => {
    getArtist(artist, resolve, reject);
  }).then((artistObj) => {
    formValidation(this, true);
    getTracks(artistObj.artistId);
    getAlbums(artistObj.artistName, artistObj.artistId);
  }).catch(() => {
    formValidation(this, false);
  });
});


/**
 * Changes tracklist when an album art is clicked
 * Cannot be an arrow function because of the 'this' binding
 */
$('.album-list-placeholder').on('click', 'img', function () {
  const albumId = $(this).data('album-id');
  const albumName = $(this).data('album-name').replace(/(unique.combo.of.words)/g, ' ');
  if (albumId === 'popularSongs') {
    const artistId = $(this).data('artist-id');
    getTracks(artistId);
  } else {
    getAlbumTracks(albumId, albumName);
  }
});
