'use strict';

var express = require('express'),
  mongojs = require('mongojs'),
  parser = require('body-parser'),
  async = require('async'),
  db = mongojs('giant', ['users', 'notes']),
  app = express(),
  users = db.users,
  notes = db.notes,
  makeObjectId = mongojs.ObjectId;

app.use(express.static(__dirname + '/src'));
app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb', extended: true}));

app.post('/auth', function (req, res) {
  users.findOne({userName: req.body.userName}, function (err, doc) {
    if (!doc) {
      res.status(400).send('User with this name can not be found.');
      return;
    }

    if (err) {
      res.status(500).send('Server error.');
      return;
    }

    if (doc.password === req.body.password) {
      res.status(200).json(doc);
    } else {
      res.status(400).send('Password is wrong.');
    }
  });
});

app.post('/register', function (req, res) {
  users.findOne({userName: req.body.userName}, function (err, doc) {
    if (doc) {
      res.status(400).send('User with this name already exists.');
      return;
    }

    if (err) {
      console.log(err);
      res.status(500).send('Server error.');
      return;
    }

    users.insert(req.body, function (err, doc) {
      console.log(err);
      if (err) {
        res.status(500).send('Server error.');
        return;
      }

      res.status(200).json(doc);
    });
  });
});

//ToDO: Rewrite this fucking callback-hell
app.post('/createNote/:userId', function (req, res) {
  var id = req.params.userId,
    userName;

  async.waterfall([
    function (callback) {
      users.findOne({_id: makeObjectId(id)}, function (err, doc) {
        callback(null, doc);
      });
    },

    function (doc, callback) {
      notes.update({
        userId: id,
      }, {
        $set: {
          userId: id,
          userName: userName
        },
        $push: {
          notes: req.body
        }
      }, {
        upsert: true
      }, callback);
    }
  ], function (err, doc) {
    if (err) {
      return res.status(500).send('Error during inserting the note');
    }
    res.status(200).send(doc);
  });
});

app.get('/getNotes/:userId', function (req, res) {
  var id = req.params.userId;
  notes.findOne({userId: id}, function (err, doc) {
    if (err) {

      res.status(500).send('Server error.');
      return;
    }
    if (doc) {
      res.json(doc.notes);
    } else {
      res.json([]);
    }
  });
});

app.get('/getUsersByPartOfName/:namePart', function (req, res) {
  var patternToMatch = new RegExp(req.params.namePart),
    dataToReturn;

  users.find({userName: {$regex: patternToMatch}}, function (err, docs) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    dataToReturn = docs.map(function(userItem) {
      return {
        _id: userItem._id,
        userName: userItem.userName
      };
    });

    res.json(dataToReturn);
  });
});

app.put('/subscribeForNotes', function (req, res) {
  users.update({
      _id: makeObjectId(req.body.currentUser)
    }, {
      $push: {watchedIDs: req.body.subscribeFor}
    }, function (err, msg) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (msg.nModified >= 1) {
        res.status(200).send('Subscription added!!!');
      } else  {
        res.status(505).send('Please try later.');
      }
  });
});

app.get('/watchedNotes/:userId', function (req, res) {
  var currentUserId = req.params.userId,
    watchedIDs;

  users.findOne({_id: makeObjectId(currentUserId)}, function (err, doc) {
    if(err) {
      return res.status(500).send('Server error.');
    }

    watchedIDs = doc ? doc.watchedIDs : [];
    // Currently, if user haven't create any notes he can not be found in notes database.
    // Do something with that motherfucker.
    notes.find({
      userId: {
        $in: watchedIDs
      }
    }, function (err, docs) {
        if(err) {
          return res.status(500).send('Server error.');
        }
        res.status(200).send(docs);
    });
  });
});

app.listen(process.env.PORT || 4000);
