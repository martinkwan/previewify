var express = require('express');
var path = require('path');
var request = require('request');
var app = express();
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/artist', (req, res) => {
  console.log(req.query.artist);
  let url = `https://api.spotify.com/v1/search?query=${req.query.artist}&type=artist`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Got something back from api to server');
      // body = JSON.parse(body)
      // console.log(body[0]);
      res.end(body);
    } else {
      console.error();
      res.end(body);
    }
  });
});

app.listen(port, function () {
  console.log('App is listening on port ' + port + '!');
});
