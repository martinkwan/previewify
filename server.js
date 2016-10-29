var express = require('express');
var path = require('path');
var request = require('request');
var app = express();
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port, function () {
  console.log('App is listening on port ' + port + '!');
});
