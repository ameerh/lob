angular.module('MainCtrl', ['ngMaterial']).controller('MainController', function($scope, $rootScope, $location, $mdSidenav, $mdMedia, $mdToast, $animate) {


    $scope.checkScreenSize = $mdMedia;
    var route = $location.url();


    $scope.branding = {
        "backgroundColor": "black",
        "fontColor": "white",
        "branding.img": "/images/partner_icons/ic_device_black.png"
    }


});