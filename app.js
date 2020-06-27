var express = require('express');
var app = express();
var path = require('path');
var public = path.join(__dirname, 'dist');

app.use(express.static(public));

// viewed at http://localhost:8080
app.get('/*', function (req, res) {
  res.sendFile(path.join(public, 'index.html'));
});

app.listen(8080);
