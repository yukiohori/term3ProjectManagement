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

    yosApp.factory('yosAppVar', function ($location) {
        var yosAppVar={};
        yosAppVar.menuState=true;
        yosAppVar.currenctPage="";
        yosAppVar.blogInfo={}

        return yosAppVar;
    });

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

            .when('/portfolio', {
                templateUrl : 'pages/portfolio.html',
                controller  : 'portfolioController'
            })

            .when('/blog', {
                templateUrl : 'pages/blog.html',
                controller  : 'blogController'
            })

            .when('/blog_detail', {
                templateUrl : 'pages/blog_detail.html',
                controller  : 'blogDetailController'
            })

            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            })

            .otherwise({redirectTo:'/'});

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

    yosApp.controller('blogController', function($scope, $http,$location , $sce,yosAppVar) {

        $scope.yosAppVar=yosAppVar;
        $scope.blogIndex=0;

        $http.get("process/blog.php")
        .then(function (response) {
            $scope.blog = response.data;
            updateiframe();
        });

         $scope.selectBlog=function(index){
            localStorage.setItem("blog_id",$scope.blog[index].id);
            $location.path("/blog_detail");
         }

        // $scope.embed=$sce.trustAsHtml($scope.blog[0].blog_embed);

        function updateiframe(){
            for(var i=0;i<$scope.blog.length;i+=1){
                $scope.blog[i].blog_index=i;
                $scope.blog[i].blog_embed=$sce.trustAsHtml($scope.blog[i].blog_embed);
                $scope.blog[i].blog_content=getFirstPara($scope.blog[i].blog_content);
            }
        }

        function getFirstPara(content){
            // console.log(content);
            // console.log($(content).find('p').prevObject[0].innerText);
            // console.log($(content).find('p').eq(0).text());
            if($(content).find('p').prevObject!=0){
                return $(content).find('p').prevObject[0].innerText;
            }else{
                return "No Content";
            }
        }
	});

    yosApp.controller('blogDetailController', function($scope,$http,yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $http.get("process/blog.php?id="+localStorage.getItem("blog_id"))
        .then(function (response) {
            $scope.blog = response.data[0];
        });

        // var req = {
        //     method: 'GET',
        //     url: 'process/blog.php',
        //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //     data: 'username='+$scope.userName+'&passwd='+$scope.userPwd
        // }

        // $http(req).then(function(response){
        //     if(response.data=="1"){
        //         $location.path("/admin");
        //     }else{
        //         $scope.error=response.data;
        //     }
        // });

	});

    
	yosApp.controller('aboutController', function($scope) {

	});

    yosApp.controller('portfolioController', function($scope) {

	});

	yosApp.controller('contactController', function($scope) {

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