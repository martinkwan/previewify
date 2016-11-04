const express = require('express');
const path = require('path');
const request = require('request');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/index.html')));

/**
 * Function to return data from spotify API
 * @param  {string} url [url of spotify api endpoint]
 * @param  {object} res [response from api endpoint]
 * @param  {object} parameters [object of parameters]
 */
function getData(url, res, parameters) {
  request({
    url,
    qs: parameters,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.end(body);
    } else {
      console.log('API is returning an error, or status code is not 200');
      res.end('error');
    }
  });
}

/**
 * Route to get artist information
 * If route is invoked from search (no artistId), run first route
 * Otherwise, if route is invoked from clicking related artist,
 * Run second route with artistId for accuracy
 */
app.get('/artist', (req, res) => {
  var url;
  let parameters;
  if (req.query.artistId === 'none') {
    url = 'https://api.spotify.com/v1/search';
    parameters = { query: req.query.artist, type: 'artist' };
  } else {
    url = `https://api.spotify.com/v1/artists/${req.query.artistId}`;
  }
  getData(url, res, parameters);
});

/**
 * Route to get artist's top ten tracks
 */
app.get('/tracks', (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.query.artistId}/top-tracks?country=US`;
  const parameters = { country: 'US' };
  getData(url, res, parameters);
});

/**
 * Route to get artist's albums
 * It uses artistName instead of artistId because of better album results (no duplicates)
 */
app.get('/albums', (req, res) => {
  const url = 'https://api.spotify.com/v1/search';
  const parameters = { query: req.query.artistName, type: 'album', market: 'US', limit: '50' };
  getData(url, res, parameters);
});

/**
 * Route to get album tracks
 */
app.get('/albumTracks', (req, res) => {
  const url = `https://api.spotify.com/v1/albums/${req.query.albumId}/tracks`;
  getData(url, res);
});

/**
 * Route to get related artists
 */
app.get('/relatedArtists', (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.query.artistId}/related-artists`;
  getData(url, res);
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));
