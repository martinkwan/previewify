/**
 * TO DO: Refactor request to api code into a resuable function (MORE DRY)
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
 * Route to get artist information
 */
app.get('/artist', (req, res) => {
  console.log(req.query.artist);
  const url = `https://api.spotify.com/v1/search?query=${req.query.artist}&type=artist`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Got artist info back from api to server');
      // body = JSON.parse(body)
      // console.log(body[0]);
      res.end(body);
    } else {
      console.error();
      res.end('error');
    }
  });
});

/**
 * Route to get artist's top ten tracks
 */
app.get('/tracks', (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.query.artistId}/top-tracks?country=US`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Got top tracks info from api to server');
      // console.log(body);
      res.end(body);
    } else {
      console.error();
      res.end('error')
    }
  })
})

/**
 * Route to get artist's albums
 */
app.get('/albums', (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.query.artistId}/albums?country=US`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Got album info from api to server');
      console.log(body);
      res.end(body);
    } else {
      console.error();
      res.end('error')
    }
  })
})

/**
 * Route to get album tracks
 */
app.get('/albumTracks', (req, res) => {
  const url = `https://api.spotify.com/v1/albums/${req.query.albumId}/tracks`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Got album tracks from api to server');
      console.log(body);
      res.end(body);
    } else {
      console.error();
      res.end('error')
    }
  })
})

app.listen(port, function () {
  console.log('App is listening on port ' + port + '!');
});
