/**
 * TO DO : Modularize template function
 */

$(function(){
  // Grab the template script
  const theTemplateScript = $('#artist-profile-template').html();

  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);

  // Define Data
  let context = {
    artistName: 'Kaskade',
    artistImg: 'https://i.scdn.co/image/ebf5bef90cea454226547b616b4a2e9006fda189',
  };

  // Pass data to template
  let theCompiledHtml = theTemplate(context);

  // Add compiled html to the page
  $('.content-placeholder').html(theCompiledHtml);
});

$('.search-form').submit((event) => {
  event.preventDefault();
  const artist = $('.search-form>input').val();
  $.get('/artist', { artist }, (artistResults) => {
    let artistObj = JSON.parse(artistResults).artists.items[0];
    populateTemplate(artistObj);
    $.get('/tracks', { artistId: artistObj.id }, (trackResults) => {
      const trackList = JSON.parse(trackResults).tracks.map(track => track.name);
      populateTrackList(trackList);
      console.log(trackList);
      $.get('/albums', { artistId: artistObj.id }, (albumResults) => {
        const albumObj = JSON.parse(albumResults).items.map((album) => {
          return { albumImg: album.images[1].url, albumId: album.id };
        });
        populateAlbumImg(albumObj);
        console.log(albumObj);
      });
    });
  });
});
/**
 * Changes tracklist when an album art is clicked
 */
$('.album-list-placeholder').on('click', 'img', function (event) {
  const albumId = $(this).data('album-id');
  $.get('/albumTracks', { albumId }, (albumTrackResults) => {
    // console.log(albumTrackResults);
    const trackList = JSON.parse(albumTrackResults).items.map(track => track.name);
    populateTrackList(trackList);
  });
});

function populateTemplate(artistObj) {

  // Grab the template script
  const theTemplateScript = $('#artist-profile-template').html();

  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);

  // Define Data
  let context = {
    artistName: artistObj.name,
    artistImg: artistObj.images[2].url,
  };

  // Pass data to template
  let theCompiledHtml = theTemplate(context);

  // Add compiled html to the page
  $('.content-placeholder').html(theCompiledHtml);
}

function populateTrackList(trackList) {
  // Grab the template script
  const theTemplateScript = $('#track-list-template').html();

  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);

  // Define Data
  let context = {
    tracks: trackList,
  };

  // Pass data to template
  let theCompiledHtml = theTemplate(context);

  // Add compiled html to the page
  $('.track-list-placeholder').html(theCompiledHtml);
}

function populateAlbumImg(albumObj){
  // Grab the template script
  const theTemplateScript = $('#album-list-template').html();

  // Compile the template
  const theTemplate = Handlebars.compile(theTemplateScript);

  // Define Data
  let context = {
    albumObj,
  };

  // Pass data to template
  let theCompiledHtml = theTemplate(context);

  // Add compiled html to the page
  $('.album-list-placeholder').html(theCompiledHtml);
}
