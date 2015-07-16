'use strict';

var express = require('express'),
  app = express(),
  mongojs = require('mongojs'),
  db = mongojs('giant', ['users']),
  parser = require('body-parser');

app.use(express.static(__dirname + '/src'));
app.use(parser.json());

app.post('/auth', function (req, res) {
  db.users.findOne({userName: req.body.userName}, function (err, doc) {
    if (!doc) {
      res.status(400).send('User with this name can not be found.');
      return;
    }

    if (err) {
      res.status(500).send('Server error.');
      return;
    }

    if (doc.password === req.body.password) {
      res.status(200).send('Success.');
    } else {
      res.status(400).send('Password is wrong.');
    }
  });
});

app.post('/register', function (req, res) {
  db.users.findOne({userName: req.body.userName}, function (err, doc) {
    if (doc) {
      res.status(400).send('User with this name already exists.');
      return;
    }

    if (err) {
      res.status(500).send('Server error.');
      return;
    }

    db.users.insert(req.body, function (err, doc) {
      if (err) {
        res.status(500).send('Server error.');
        return;
      }

      res.status(200).json(doc);
    });
  });
});

app.listen(3000);
