  'use strict';

  var express = require('express');
  var controller = require('./poll.controller');

  var router = express.Router();

router.get('/:user_name', controller.index);
router.get('/:id', controller.show);
router.get('/:user_name/:poll_name', controller.showPoll);
router.post('/', controller.create);
router.put('/:id/:val', controller.update);
router.patch('/:id', controller.update);
router.delete('/:poll_name', controller.destroy);

module.exports = router;
