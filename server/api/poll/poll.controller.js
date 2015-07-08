'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls by user
exports.index = function(req, res) {
  Poll.find({user_name: req.params.user_name}, function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};

// Get a single poll
exports.show = function(req, res) { //But we want to find the poll based on the username and the poll name ...
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    return res.json(poll);
  });
};

exports.showPoll = function(req, res) {
  var user_name = req.params.user_name;
  var poll_name = req.params.poll_name;
  Poll.find({user_name: user_name, poll_name: poll_name}, function(err, poll) {
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.json(201, poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  var update = {/*$push: {},*/ $inc: {}};
  var field = 'poll_results.' + req.params.val;
  update.$inc[field] = 1;
  //update.$push['voted_users'] = req.params.current_user;
  var query = {_id: req.params.id};
  //{$inc: {'poll_results.1': 1}} //this doesn't work in place of update...hmph
  Poll.update(query, update, function(err, num, doc) {
    if(err) console.log(err);
    else {
      console.log('Updated ' + doc);
      res.json(201, doc);
    }
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.remove({poll_name: req.params.poll_name}, function(err, poll) {
    if (err) { return handleError(res, err); }
  });
};
//  Poll.find({poll_name: req.params.poll_name}, function (err, poll) {
//    if(err) { return handleError(res, err); }
//    if(!poll) { return res.send(404); }
//    poll.remove(function(err) {
//      if(err) { return handleError(res, err); }
//      return res.send(204);
//    });
//  });
//};

function handleError(res, err) {
  return res.send(500, err);
}
