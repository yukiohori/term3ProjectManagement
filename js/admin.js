// Menu Jquery Section

// var menuShow=false;

// $(document).on('click', '#mobileMenu', function() {
//     menuShow=true;
//     $('#mobileMenuBox').fadeIn(200);
// });

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

$(document).on('click', '.dashboard-option-style', function() {
    $('#dashBoardOptions').css('width','0');
    $('.dashboard-option-style').each(function(){
        $(this).animate({'opacity':'0'},10);
    });
    $('#dashboard-menutitle-style').animate({'opacity':'0'},10);
    $('#closeDashBoardMenu').animate({'opacity':'0'},10);
});

// $(document).on('dblclick', '.cmtedit', function (e) {
//    TBox(this);
// });

// $(document).on('blur', "input",function (e) {
//    RBox(this);
// });

// $(document).on('click', '#mobileMenuClose', function() {
//     menuShow=false;
//     $('#mobileMenuBox').fadeOut(200);
// });

// $( window ).resize(function() {
//     if($(window).width()>1024){
//         $('#mobileMenuBox').css('display','block');
//     }else{
//         if(menuShow){
//             $('#mobileMenuBox').css('display','block');
//         }else{
//             $('#mobileMenuBox').css('display','none');
//         }
//     }
// });


// $(document).on('click', '#nextBtn', function() {
//     setCookie(1);
//     $('#closeOverlay').animate({'height':'100vh'},700,function(){
//         window.location.replace("#home");
//     });
// });


// END Menu Jquery Section

// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize','ngAnimate']);

    yosApp.factory('yosAppVar', function ($location) {
        var yosAppVar={};
        yosAppVar.menuState=true;
        yosAppVar.currenctPage="";

        yosAppVar.goHomepage = function(){
            window.location.href = "index.html";
        };

        yosAppVar.goBlogAdmin = function(){
             $location.path("/blog");
        };

        yosAppVar.goAboutAdmin = function(){
             $location.path("/about");
        };

        yosAppVar.goFeaturesAdmin = function(){
             $location.path("/features");
        };

        yosAppVar.logout= function(){
            $location.path("/login");
        };

        return yosAppVar;
    });

    yosApp.config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/dashboard/login.html',
                controller  : 'loginController'
            })

            .when('/login', {
                templateUrl : 'pages/dashboard/login.html',
                controller  : 'loginController'
            })

            .when('/admin', {
                templateUrl : 'pages/dashboard/admin.html',
                controller  : 'adminController'
            })

            .when('/blog', {
                templateUrl : 'pages/dashboard/admin_blog.html',
                controller  : 'adminBlogController'
            })

            .when('/about', {
                templateUrl : 'pages/dashboard/admin_about.html',
                controller  : 'adminAboutController'
            })

            .when('/features', {
                templateUrl : 'pages/dashboard/admin_features.html',
                controller  : 'adminFeaturesController'
            })
            .otherwise({redirectTo:'/'});

        $locationProvider.hashPrefix('');
    });

   
    yosApp.controller('loginController', function($scope, $http,$location,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=false;
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

	});

    yosApp.controller('adminBlogController', function($scope, $http, $sce,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        $http.get("process/blog.php")
        .then(function (response) {
            console.log(response);
            $scope.blog = response.data;
        });

		$scope.content = '';
	});

    yosApp.controller('adminAboutController', function($scope, $http, $sce,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        // $http.get("process/blog.php")
        // .then(function (response) {
        //     console.log(response);
        //     $scope.blog = response.data;
        // });

		$scope.content = '';
	});

    yosApp.controller('adminFeaturesController', function($scope, $http, $sce,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        // $http.get("process/blog.php")
        // .then(function (response) {
        //     console.log(response);
        //     $scope.blog = response.data;
        // });

		$scope.content = '';
	});

    yosApp.controller('adminController', function($scope,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
		$scope.message = '';
	});


// END Angular Section

// function TBox(obj) {
//         var id = $(obj).attr("id");
//         var tid = id.replace("cmt_edit_", "cmt_tedit_");
//         var input = $('<input />', { 'type': 'text', 'name': 'n' + tid, 'id': tid, 'class': 'text_box', 'value': $(obj).html() });
//         $(obj).parent().append(input);
//         $(obj).remove();
//         input.focus();
// }
// function RBox(obj) {
//     var id = $(obj).attr("id");
//     var tid = id.replace("cmt_tedit_", "cmt_edit_");
//     var input = $('<p />', { 'id': tid, 'class': 'cmtedit', 'html': $(obj).val() });
//     $(obj).parent().append(input);
//     $(obj).remove();
// }