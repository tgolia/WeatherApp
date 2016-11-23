(function() {
    'use strict';

    angular
        .module('app')
        .controller('WeatherController', WeatherController);

    WeatherController.$inject = ['$http', 'toastr'];

    function WeatherController($http, toastr) {
        var vm = this;

        vm.callWeatherApi = callWeatherApi;
        vm.secret = secret;
        vm.hidden = true;
        vm.searches = [];

        vm.convertToF = function(temp) {
            var toF = temp * (9 / 5) - 459.67;
            return toF;
        }

        vm.convertTemps = function() {
            vm.city.main.temp = vm.convertToF(vm.city.main.temp);
            vm.city.main.temp_max = vm.convertToF(vm.city.main.temp_max);
            vm.city.main.temp_min = vm.convertToF(vm.city.main.temp_min);
        }

        vm.addToSearchHistory = function() {
            vm.searches.push({
                city: vm.city.name,
                date: vm.date,
                time: vm.time
            });
        }

        vm.convertTimeFormat = function() {
            vm.date = new Date(new Date().getTime()).toLocaleDateString();
            vm.time = new Date(new Date().getTime()).toLocaleTimeString();
        }

        //vm.secret = function() {
        //    toastr.info('You found the secret button. You win a lifetime supply of CSS trivia cards!', 'CONGRATS!!!');
        //}

        /////////////////////////

        /* @ngInject */
        function callWeatherApi(city) {
            $http
                .get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=115b5c71f21e60d68e84c7032f527c68')
                .then(function(response) {
                    if (city == null || city == '') {
                        toastr.warning('Please enter a city or click on one of the blue city tabs.');
                    } else {
                        vm.city = response.data;
                        vm.convertTemps();
                        vm.iconUrl = 'http://openweathermap.org/img/w/' + vm.city.weather[0].icon + '.png';
                        vm.convertTimeFormat();
                        vm.addToSearchHistory();
                        vm.hidden = false;
                        toastr.success('API retreived.', 'Success!');
                    }
                })
                .catch(function(error) {
                    if (city == '') {
                        toastr.warning('Please enter a city or click on one of the blue city tabs.');
                    } else {
                        toastr.error("It's likely because we couldn't find the city you entered.", 'An error occured downloading ' + city + ' from the OpenWeatherMap API.');
                    }
                });
        }

        function secret() {
        	toastr.info('You found the secret button. You win a lifetime supply of CSS trivia cards!', 'CONGRATS!!!');
        }
    }
})();
