'use strict';

var express = require('express'),
  app = express(),
  mongojs = require('mongojs'),
  db = mongojs('giant', ['users', 'notes']),
  parser = require('body-parser'),
  ObjectId = mongojs.ObjectId;

app.use(express.static(__dirname + '/src'));
app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb', extended: true}));

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
      res.status(200).json(doc);
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
      console.log(err);
      res.status(500).send('Server error.');
      return;
    }

    db.users.insert(req.body, function (err, doc) {
      console.log(err);
      if (err) {
        res.status(500).send('Server error.');
        return;
      }

      res.status(200).json(doc);
    });
  });
});


app.post('/createNote/:userId', function (req, res) {
  var id = req.params.userId;

  db.notes.findOne({userId: id}, function (err, doc) {
    if (!doc) {
      db.notes.insert({
        userId: id,
        notes: [req.body]
      }, function (err, doc) {
        if (err) {
          res.status(500).send('Server error.');
          return;
        }

        res.json(doc);
      });
    } else {
      db.notes.update({
        userId: id
      }, {
        $push: {
          'notes': req.body
        }
      },
      function (err, doc) {
        if (err) {
          res.status(500).send('Server error.');
          return;
        }

        res.json(doc);
      });
    }

    if (err) {
      res.status(500).send('Server error.');
      return;
    }
  });
});

app.get('/getNotes/:userId', function (req, res) {
  var id = req.params.userId;
  db.notes.findOne({userId: id}, function (err, doc) {
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

  db.users.find({userName: {$regex: patternToMatch}}, function (err, docs) {
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
  db.users.update({
      _id: ObjectId(req.body.currentUser)
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
    watchedIDs,
    watchedObjectIds;

  db.users.findOne({_id: ObjectId(currentUserId)}, function (err, doc) {
    if(err) {
      return res.status(500).send('Server error.');
    }

    watchedIDs = doc.watchedIDs || [];
    watchedObjectIds = watchedIDs.map(function(item) {
      return ObjectId(item);
    });

    console.log(watchedIDs)
    db.notes.find({
      userId: {
        $in: doc.watchedIDs
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
