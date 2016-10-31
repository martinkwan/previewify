/**
 * TO DO : Modularize template function
 * Change to promises
 */

/**
 * Handlebar template function
 * @param  {Object} obj              [Object of data to render]
 * @param  {String} templateSelector [String of DOM location to render to]
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
      populateTemplate({ trackList }, 'track-list');
      $.get('/albums', { artistId: artistObj.artistId }, (albumResults) => {
        const albumObj = JSON.parse(albumResults).items.map((album) => {
          return { albumImg: album.images[1].url, albumId: album.id };
        });
        populateTemplate({ albumObj }, 'album-list');
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
  $.get('/albumTracks', { albumId }, (albumTrackResults) => {
    // console.log(albumTrackResults);
    const trackList = JSON.parse(albumTrackResults).items.map(track => track.name);
    populateTemplate(trackList, 'track-list');
  });
});
