// Menu Jquery Section

var menuShow=false;

$(document).on("click", "#mobileMenu", function() {
    menuShow=true;
    $('#mobileMenuBox').fadeIn(200);
});

$(document).on("click", "#mobileMenuClose", function() {
    menuShow=false;
    $('#mobileMenuBox').fadeOut(200);
});

$( window ).resize(function() {
    if($(window).width()>1024){
        $('#mobileMenuBox').css('display','block');
    }else{
        if(menuShow){
            $('#mobileMenuBox').css('display','block');
        }else{
            $('#mobileMenuBox').css('display','none');
        }
    }
});

// END Menu Jquery Section

// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute']);

    // configure our routes
    yosApp.config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/intro.html',
                controller  : 'mainController'
            })

            .when('/home', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            .when('/blog', {
                templateUrl : 'pages/blog.html',
                controller  : 'mainController'
            })

            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });

        $locationProvider.hashPrefix('');
    });

	yosApp.controller('mainController', function($scope) {
		$scope.message = 'Everyone come and see how good I look!';
	});

	yosApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
		$scope.content = 'asdasd<div>Hello</div>';
	});

	yosApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

// END Angular Section
