'use strict';

var express = require('express');
var controller = require('./poll.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:user_name/:poll_name', controller.showPoll);
router.post('/', controller.create);
router.put('/:user_name/:poll_name/:val/:current_user', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
