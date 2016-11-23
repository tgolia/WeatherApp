(function() {
    'use strict';

    angular
        .module('app')
        .controller('WeatherController', WeatherController);

    WeatherController.$inject = ['$http'];

    function WeatherController($http) {
        var vm = this;

        vm.callWeatherApi = callWeatherApi;

        vm.searches = [];

        vm.roundToDecimal = function(num,dec) {     
      		var rounded = (Math.round(num * Math.pow(10,dec)) / Math.pow(10,dec)).toFixed(dec);
      		return rounded;
    	}

		vm.convertToF = function(temp) {      
     		var toF = temp*(9/5)-459.67;
      		return toF;
    	}

    	vm.hidden = true;

        /////////////////////////

        /* @ngInject */
        function callWeatherApi(city) {
            $http
            .get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID=115b5c71f21e60d68e84c7032f527c68')
            .then(function(response) {
            	if (city == null) {
            		alert('Please enter a city or click on one of the tabs.');
            	} else {
	            	vm.city = response.data;
	            	vm.city.main.temp = vm.roundToDecimal(vm.convertToF(vm.city.main.temp),2);
	            	vm.city.main.temp_max = vm.roundToDecimal(vm.convertToF(vm.city.main.temp_max),2);
	            	vm.city.main.temp_min = vm.roundToDecimal(vm.convertToF(vm.city.main.temp_min),2);
	            	vm.iconUrl = 'http://openweathermap.org/img/w/' + vm.city.weather[0].icon + '.png';
	            	vm.date = new Date(new Date().getTime()).toLocaleDateString();
	              	vm.time = new Date(new Date().getTime()).toLocaleTimeString();
	            	vm.searches.push({
	            		city : vm.city.name ,
	            		date : vm.date,
	            		time : vm.time
	            	});
	            	vm.hidden = false;
	            	console.log(vm.searches);
	                console.log(vm.city);
	            }
            })
            .catch(function(error) {
            	alert('An error occured downloading '+city+' from the OpenWeatherMap API');
            });
        }
    }
})();