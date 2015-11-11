angular.module('Ctrl', ['ngMaterial', 'schemaForm','ngFileUpload']).controller('Controller', function($scope, $mdToast, $rootScope, $timeout, $mdSidenav,$location, $mdDialog, Service, Upload) {



    $scope.getPostCards = function(){

        if($scope.offSet && $scope.offSet != 0 && $scope.offSet % 100 != 0){
            $scope.inValid = true;
        }

        else{
            var offSet = $scope.offSet || 0;
            $scope.showWaiting = true;
            $scope.inValid = false;
            Service.getPostCards(offSet, function(data){
                    console.log(data)
                    $scope.postCards = data.data;
                    if($scope.postCards.length ==0){
                        $scope.noResult = true;
                        $timeout(function(){
                            $scope.noResult = false;
                        }, 5000)
                    }
                    console.log($scope.postCards)
                    $scope.showWaiting = false;
                },
                function(err){
                    console.log(err)
                    $scope.showWaiting = false;
                })
        }

    }

    $scope.createPostCard = function(){
        $scope.showWaiting = true;
        var files=$scope.files;
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/create-post-card',
                    fields: {
                        model : $scope.model
                    },
                    file : file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $timeout(function(){
                        $scope.postCards = data;
                    }, 10000)
                    $scope.showWaiting = false;
                    //$scope.postCards = data;
                    console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
                    console.log(data);

                    if(data.message){
                        var toast = $mdToast.simple()
                            .content(data.message)
                            .action('OK')
                            .highlightAction(false)
                            .hideDelay(6000)
                        $mdToast.show(toast);
                    }
                    else{
                        var toast = $mdToast.simple()
                            .content("Successfully Submitted. Wait A Few Seconds Before Images Display")
                            .action('OK')
                            .highlightAction(false)
                            .hideDelay(6000)

                        $mdToast.show(toast);
                    }

                });
            }
        }
    }

    $scope.openUpdateDialog = function(assetID, assetTypeID, ev){
        $mdDialog.show({
            controller: UpdateController,
            templateUrl: '/views/update.html',
            locals : {
                assetID : assetID,
                assetTypeID : assetTypeID
            },
            targetEvent: ev
        })
            .then(function(data) {
                console.log(data)
                if(data){
                    $rootScope.assets = data
                }
                console.log($rootScope.assets)
                $scope.alert = 'You did not cancelled the dialog.';
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    }


    $scope.openCreateDialog = function(ev) {
        $mdDialog.show({
            controller: CreateController,
            templateUrl: '/views/create.html',
            targetEvent: ev
        })
            .then(function(data) {
                console.log(data)
                if(data){
                    $rootScope.resultAssets = data
                    callCreateToast()
                }

            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    };


    $scope.toastPosition = {
        bottom: true,
        top: false,
        left: true,
        right: false

    };
    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };

    function callCreateToast(){
        var toast = $mdToast.simple()
            .content('Created')
            .action('OK')
            .highlightAction(false)
            .position($scope.getToastPosition());
        $mdToast.show(toast);
    }

})


function CreateController($scope, $mdDialog,Upload, $rootScope) {

    $scope.close = function() {
        $mdDialog.hide();
    }

}


function UpdateController($scope, $mdToast, $rootScope, assetID, assetTypeID, $mdDialog){
    $scope.close = function() {
        $mdDialog.hide();
    };
}









