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
        const albumList = JSON.parse(albumResults).items.map(album => album.name);
        console.log(albumList);
      })
    })
  })
})

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
