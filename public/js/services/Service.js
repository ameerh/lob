angular.module('Service', []).factory('Service', ['$http', function($http) {

    return{
        create : function(id, data, success,error){
            $http.post('/create/'+id, data , {}).
                success(function(data){
                    success(data)
                }).
                error(function(data){
                    error(data);
                });
        }
    }

}]);
