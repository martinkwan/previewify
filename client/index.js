/**
 * TO DO : Modularize template function
 * Change to promises
 */

$(() => {
  // Grab the template script
  const theTemplateScript = $('#artist-profile-template').html();
  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);
  // Define Data
  const context = {
    artistName: 'Kaskade',
    artistImg: 'https://i.scdn.co/image/ebf5bef90cea454226547b616b4a2e9006fda189',
  };
  // Pass data to template
  const theCompiledHtml = theTemplate(context);
  // Add compiled html to the page
  $('.artist-profile-placeholder').html(theCompiledHtml);
});

function populateArtistProfile(artistObj) {
  // Grab the template script
  const theTemplateScript = $('#artist-profile-template').html();
  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);
  // Pass data to template
  const theCompiledHtml = theTemplate(artistObj);
  // Add compiled html to the page
  $('.artist-profile-placeholder').html(theCompiledHtml);
}

function populateTrackList(trackList) {
  const theTemplateScript = $('#track-list-template').html();
  const theTemplate = Handlebars.compile(theTemplateScript);
  const theCompiledHtml = theTemplate(trackList);
  $('.track-list-placeholder').html(theCompiledHtml);
}

function populateAlbumImg(albumObj){
  const theTemplateScript = $('#album-list-template').html();
  const theTemplate = Handlebars.compile(theTemplateScript);
  const theCompiledHtml = theTemplate(albumObj);
  $('.album-list-placeholder').html(theCompiledHtml);
}


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
    populateArtistProfile(artistObj);
    $.get('/tracks', { artistId: artistObj.artistId }, (trackResults) => {
      const trackList = JSON.parse(trackResults).tracks.map(track => track.name);
      populateTrackList({ trackList });
      $.get('/albums', { artistId: artistObj.artistId }, (albumResults) => {
        const albumObj = JSON.parse(albumResults).items.map((album) => {
          return { albumImg: album.images[1].url, albumId: album.id };
        });
        populateAlbumImg({ albumObj });
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
    populateTrackList(trackList);
  });
});
