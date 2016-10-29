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
  $.get('/artist', { artist }, (results) => {
    let artistObj = JSON.parse(results).artists.items[0];
    console.log(artistObj);
    populateTemplate(artistObj);
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
