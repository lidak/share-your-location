'use strict';

var express = require('express'),
  app = express(),
  mongojs = require('mongojs'),
  db = mongojs('giant', ['users']),
  parser = require('body-parser');

app.use(express.static(__dirname + '/src'));
app.use(parser.json());

db.users.find(function (err, docs) {

});

app.post('/auth', function (req, res) {
  db.users.findOne({username: req.body.userName}, function (err, doc) {
    console.log(doc)
    if (!doc) {
      res.status(401).send('user with this name can not be found');
      return;
    }

    if (err) {
      res.status(500).send('server error');
      return;
    }

    if (doc.password === req.body.password) {
      res.status(200).send('success');
    } else {
      res.status(401).send('password is wrong');
    }
  });
});

app.listen(3000);
