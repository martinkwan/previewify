/**
 * TO DO:
 *
 */
const express = require('express');
const path = require('path');
const request = require('request');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/client/index.html')));

/**
 * Function to return data from spotifi API
 * @param  {String} url [url of spotify api endpoint]
 * @param  {Object} res [Response from api endpoint]
 */
function getData(url, res) {
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.end(body);
    } else {
      console.error();
      res.end('error');
    }
  });
}

/**
 * Route to get artist information
 */
app.get('/artist', (req, res) => {
  const url = `https://api.spotify.com/v1/search?query=${req.query.artist}&type=artist`;
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
 */
app.get('/albums', (req, res) => {
  const url = `https://api.spotify.com/v1/search?query=${req.query.artistName}&type=album`;
  getData(url, res);
});

/**
 * Route to get album tracks
 */
app.get('/albumTracks', (req, res) => {
  const url = `https://api.spotify.com/v1/albums/${req.query.albumId}/tracks`;
  getData(url, res);
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));
