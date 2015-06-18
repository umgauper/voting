'use strict';

angular.module('votingApp')
  .controller('NewpollCtrl', function($scope) {
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollOptions = [];

    $scope.addPoll = function() {
      alert('hello!');
    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };





  });
