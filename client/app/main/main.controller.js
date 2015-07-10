'use strict';

angular.module('votingApp')

  .controller('MainCtrl', function ($scope, $http, $location, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.page = 'newPoll';
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollName = {name: ''}; //doesn't work if $scope.pollName = '';
    $scope.pollOptions = [];
    $scope.pollResults = [];
    $scope.currentUser = Auth.getCurrentUser().name;

    $scope.loadPoll = function(user_name, poll_name, page) {
      //Load result page or vote page
      $http.get('/api/polls/' + user_name + '/' + poll_name)
        .success(function(data, status) {
          if(data[0]) {
            //for graph
            console.log(data[0].poll_results);
            console.log(data[0].poll_options);
            var arr = [];
            arr.push(data[0].poll_results);
            $scope.data = arr;
            $scope.labels = data[0].poll_options;

            //for voting form
            $scope.pollName = data[0].poll_name;
            $scope.pollCreator = data[0].user_name;
            $scope.pollOptions = data[0].poll_options;
            $scope._id = data[0]._id;
          }

          $scope.page = page;
          if(page === 'results') {
            $('.results').css({display: "block", visibility: "visible", backgroundColor: "pink"})
          }
        })
        .error(function(data, status) {
          console.log(status);
        });
    };

    $scope.addPoll = function() {
      console.log('Submitting poll for ' + Auth.getCurrentUser().name + '...');
      // Remove all non alphanumeric characters (excluding white space) from poll-name.
      $scope.pollName = $scope.pollName.name.split('').map(function(el) {
        if( /[\w\s]/.test(el) ) {
          return el
        }
      }).join('');

      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name,
        poll_name: $scope.pollName,
        poll_options: $scope.pollOptions,
        poll_results: $scope.makeArr($scope.pollOptions.length)
      }).success(function() {
        console.log('New poll posted');
        $scope.page = 'newPollPosted';
        //reset the form and models
        $scope.pollName = {name: ''};
        $scope.pollOptions = [];

      });
      //create URL for the new poll
      $scope.url = '';
      $scope.url = window.location + Auth.getCurrentUser().name + '/' + $scope.pollName;
    };

    $scope.loadNewPoll = function() {
      $('.results').css("display", "none");
      $scope.page = 'newPoll';
      //reset the form and models
      $scope.pollName = {name: ''};
      $scope.pollOptions = [];
      $location.path('/');
    };

    $scope.addVote = function() {
      var val = $("input[type='radio']:checked").val();
      console.log("Submitting " + Auth.getCurrentUser().name + "'s vote for poll id: " + $scope._id);
      val = Number(val);
      $http.put('api/polls/' + $scope._id +'/' + val).success
      (function(result) {
          console.log('Vote submitted');
          $scope.loadPoll($scope.pollCreator, $scope.pollName, 'results');
        }
      );
    };

    $scope.loadAllPolls = function() {
      $http.get('api/polls/' + Auth.getCurrentUser().name).success(function(data) {
        $scope.polls = data;
        $('.results').css("display", "none");
        $scope.page = 'allPolls';
      });
    };

    $scope.deletePoll = function(poll) {
      $http.delete('api/polls/' + poll).success(function() {
        var id = poll;
        id = '#' + id.split(' ')[0];
        $(id).remove();
      });
    };

    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };

    $scope.makeArr = function(x) {
      var arr=[];
      for(var i = 0; i < x; i++) {
        arr.push(0);
      }
      return arr;
    };

    if(/[^\/].*(?=\/)/.test($location.path())) { // load poll when /user_name/poll_name is requested
      $scope.page = '';
      var paths = $location.path();
      var user_name = paths.match(/[^\/].*(?=\/)/);        //parse out username and path
      var poll_name = paths.match(/.\/.*(?=$)/);
      poll_name = poll_name[0].substr(2, poll_name[0].length);
      $scope.loadPoll(user_name, poll_name, 'vote');
    }
  });
