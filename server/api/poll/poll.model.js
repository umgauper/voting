'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  user_name: String,
  poll_name: String,
  poll_options: [],
  poll_results: [],
  votes: [],
  voted_users: [],
  comments: [],
  val: Number
});

module.exports = mongoose.model('Poll', PollSchema);
