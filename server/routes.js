/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/polls', require('./api/poll'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));

  //app.use('/:user_name/:poll_name', require('./api/poll'));


  // This does not work...
  //
  //app.route('/*/*')
  //  .get(function(req, res) {
  //    res.send('test');
  //  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

   //All other routes should redirect to the index.html TODO: THis really shouldn't be disabled....
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
