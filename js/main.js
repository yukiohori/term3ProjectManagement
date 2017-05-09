// Menu Jquery Section

var menuShow=false;

$(document).on('click', '#mobileMenu', function() {
    menuShow=true;
    $('#mobileMenuBox').fadeIn(200);
});

$(document).on('click', '#dashBoardMenu', function() {
    $('#dashBoardOptions').css('width','30%');
    $('.dashboard-option-style').each(function(){
        $(this).animate({'opacity':'1'},600);
    });
    
    $('#dashboard-menutitle-style').animate({'opacity':'1'},600);
    $('#closeDashBoardMenu').animate({'opacity':'1'},700);
});

$(document).on('click', '#closeDashBoardMenu', function() {
    $('#dashBoardOptions').css('width','0');
    $('.dashboard-option-style').each(function(){
        $(this).animate({'opacity':'0'},10);
    });
    $('#dashboard-menutitle-style').animate({'opacity':'0'},10);
    $('#closeDashBoardMenu').animate({'opacity':'0'},10);
});

$(document).on('click', '.menu-style li', function() {
    if($(window).width()<1024){
        menuShow=false;
        $('#mobileMenuBox').fadeOut(200);
    }
});

$(document).on('click', '#mobileMenuClose', function() {
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


$(document).on('click', '#nextBtn', function() {
    setCookie(1);
    $('#closeOverlay').animate({'height':'100vh'},700,function(){
        window.location.replace("#home");
    });
});


// END Menu Jquery Section

// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize','ngAnimate']);

    yosApp.config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/intro.html',
                controller  : 'introController'
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
                controller  : 'blogController'
            })

            .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            .when('/admin', {
                templateUrl : 'pages/admin.html',
                controller  : 'adminController'
            })

            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });

        $locationProvider.hashPrefix('');
    });

	yosApp.controller('mainController', function($scope) {
		$scope.message = '';
        $scope.load = function () {
            if(checkCookie()){
                $('#openOverlay').animate({'height':'0'},1000);
                deleteCookie();
            }else{
                $('#openOverlay').css({'display':'none'});
            }
        }
	});

    yosApp.controller('introController', function($scope) {
        $scope.load = function () {
            deleteCookie();
        }
	});

    yosApp.controller('blogController', function($scope, $http, $sce) {
        $http.get("process/blog.php")
        .then(function (response) {
            console.log(response);
            $scope.blog = response.data;
            // console.log($scope.blog[0].blog_embed);
            updateiframe();
        });

        // $scope.embed=$sce.trustAsHtml($scope.blog[0].blog_embed);

        function updateiframe(){
            for(var i=0;i<$scope.blog.length;i+=1){
                $scope.blog[i].blog_embed=$sce.trustAsHtml($scope.blog[i].blog_embed);
            }
        }

		$scope.content = '';
	});

	yosApp.controller('aboutController', function($scope) {
		$scope.message = '';
		$scope.content = '';
	});

    yosApp.controller('loginController', function($scope, $http,$location) {

        $scope.userName="";
        $scope.userPwd="";
        $scope.error="";

        $scope.login = function(){
            var req = {
                method: 'POST',
                url: 'process/login.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: 'username='+$scope.userName+'&passwd='+$scope.userPwd
            }

            $http(req).then(function(response){
                if(response.data=="1"){
                    $location.path("/admin");
                }else{
                    $scope.error=response.data;
                }
            });
        };

        $scope.goHomepage = function(){
            $location.path("/home");
        };
	});

    yosApp.controller('adminController', function($scope,$location) {
		$scope.message = '';
        $scope.logout= function(){
            $location.path("/login");
        };
	});

	yosApp.controller('contactController', function($scope) {
		$scope.message = '';
	});

// END Angular Section

// Cookie Function

function setCookie(exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires='+d.toUTCString();
    document.cookie = 'access = true ;' + expires + ';path=/';
}

function deleteCookie(){
   document.cookie = 'access =;Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie() {
    var user = getCookie('access');
    if (user != "") {
        return true;
    } else {
        return false;
    }
}

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// END Cookie Function