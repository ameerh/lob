/**
 * Created by macbookpro on 14/04/15.
 */
angular.module('SignInCtrl', ['ngMaterial']).controller('SignInController', function($scope, $timeout, $mdSidenav,$location, $mdDialog, $mdToast, $animate) {

    $scope.hide = false
    $scope.signIn=function(){
        $location.path('/splash');
    };





});