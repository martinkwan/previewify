/**
 * TO DO :
 * Change to promises, make get request DRY
 */

/**
 * Handlebar template function
 * @param  {Object} obj              [Object of data to render]
 * @param  {String} templateSelector [DOM location to select template and to render to]
 */
function populateTemplate(obj, templateSelector) {
  // Grab the template script
  const theTemplateScript = $(`#${templateSelector}-template`).html();
  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);
  // Pass data to template
  const theCompiledHtml = theTemplate(obj);
  // Add compiled html to the page
  $(`.${templateSelector}-placeholder`).html(theCompiledHtml);
}

/**
 * On submit form, get data from spotify API and render to page using handlebar templates
 */
$('.search-form').submit((event) => {
  event.preventDefault();
  const artist = $('.search-form>input').val();
  $.get('/artist', { artist }, (artistResults) => {
    let artistObj = JSON.parse(artistResults).artists.items[0];
    artistObj = {
      artistName: artistObj.name,
      artistImg: artistObj.images[2].url,
      artistId: artistObj.id,
    };
    populateTemplate(artistObj, 'artist-profile');
    $.get('/tracks', { artistId: artistObj.artistId }, (trackResults) => {
      const trackList = JSON.parse(trackResults).tracks.map(track => track.name);
      populateTemplate({ trackList, albumName: 'Popular' }, 'track-list');
      $.get('/albums', { artistName: artistObj.artistName }, (albumResults) => {
        const albumObj = JSON.parse(albumResults).albums.items.map((album) => {
          return { albumImg: album.images[1].url, albumId: album.id, albumName: album.name.replace(/\s/g, 'unique.combo.of.words') };
        });
        const artistId = artistObj.artistId;
        populateTemplate({ albumObj, artistId }, 'album-list');
      });
    });
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
    $.get('/tracks', { artistId }, (trackResults) => {
      const trackList = JSON.parse(trackResults).tracks.map(track => track.name);
      populateTemplate({ trackList, albumName }, 'track-list');
    });
  } else {
    $.get('/albumTracks', { albumId }, (albumTrackResults) => {
      const trackList = JSON.parse(albumTrackResults).items.map(track => track.name);
      populateTemplate({ trackList, albumName }, 'track-list');
    });
  }
});
