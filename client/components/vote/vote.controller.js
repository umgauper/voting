'use strict';

angular.module('votingApp')
  .controller('VoteCtrl', function($scope, $location, Auth) {
  $scope.isLoggedIn = Auth.isLoggedIn;

  $scope.page = 'vote';
    //console.log($scope.isLoggedIn);

});
