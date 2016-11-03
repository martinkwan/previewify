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
 */
function getData(url, res) {
  request(url, (error, response, body) => {
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
 * For search form submissions, use artist name as a parameter
 * For related artist onclick events,
 * use artist ID as a parameter (to properly load foreign artists)
 */
app.get('/artist', (req, res) => {
  const url = req.query.artistId === 'none' ? `https://api.spotify.com/v1/search?query=${req.query.artist}&type=artist`
                                            : `https://api.spotify.com/v1/artists/${req.query.artistId}`;
  getData(url, res);
});

/**
 * Route to get artist's top ten tracks
 */
app.get('/tracks', (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.query.artistId}/top-tracks?country=US`;
  getData(url, res);
});

/**
 * Route to get artist's albums
 * First it uses artistName instead of artistId because of better album results (no duplicates)
 * It only uses artistId when using artistName returns an error (mainly for foreign languages)
 */
app.get('/albums', (req, res) => {
  const url = req.query.firstTry === 'true' ? `https://api.spotify.com/v1/search?query=${req.query.artistName}&type=album&market=US&limit=50`
                                            : `https://api.spotify.com/v1/artists/${req.query.artistId}/albums?market=US&album_type=album`;
  getData(url, res);
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
