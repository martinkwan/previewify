$(function(){
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
  let theCompiledHtml = theTemplate(context);

  // Add compiled html to the page
  $('.content-placeholder').html(theCompiledHtml);
});
