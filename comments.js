// create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({dest: 'uploads/'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create a comment
app.post('/', function(req, res) {
  var comment = req.body.comment;
  var user = req.body.user;
  var date = new Date();
  var newComment = {
    comment: comment,
    user: user,
    date: date
  };
  fs.readFile('./comments.json', 'utf8', function(err, data) {
    var comments;
    if (err) {
      comments = [];
    } else {
      comments = JSON.parse(data);
    }
    comments.push(newComment);
    fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
      if (err) {
        res.status(500).send('Could not save comment');
      } else {
        res.status(201).send(newComment);
      }
    });
  });
});

// get all comments
app.get('/', function(req, res) {
  fs.readFile('./comments.json', 'utf8', function(err, data) {
    if (err) {
      res.status(500).send('Could not read comments');
    } else {
      res.status(200).send(data);
    }
  });
});

// get comment by id
app.get('/:id', function(req, res) {
  var id = req.params.id;
  fs.readFile('./comments.json', 'utf8', function(err, data) {
    if (err) {
      res.status(500).send('Could not read comments');
    } else {
      var comments = JSON.parse(data);
      var comment = comments[id];
      if (comment) {
        res.status(200).send(comment);
      } else {
        res.status(404).send('Comment not found');
      }
    }
  });
});

// update comment by id
app.put('/:id', function(req, res) {
  var id = req.params.id;
  var newComment = req.body.comment;
  fs.readFile('./comments.json', 'utf8', function(err, data) {
    if (err) {
      res.status(500).send('Could not read comments');
    } else {
      var comments = JSON.parse(data);
      var comment =