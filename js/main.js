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


// END Menu Jquery Section

// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize','ngAnimate']);

    yosApp.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    });

//     yosApp.directive("scroll", function ($window) {
//         return function(scope, element, attrs) {
//         // console.log('scrolling');
//             angular.element($window).bind("scroll", function() {
//                 console.log(angular.element(document).find('img')[1]);
//                 console.log('scrolling '+this.pageYOffset);
                
//                 if((angular.element(document).find('img')[1].offsetTop-300)<this.pageYOffset){
//                     angular.element(document).find('img')[1].className='active-show';
//                 }
// // angular.element(element).addClass('myDraggable');

//                 // if (this.pageYOffset >= ) {
//                 //     scope.boolChangeClass = true;
//                 //     console.log('Scrolled below header.');
//                 // } else {
//                 //     scope.boolChangeClass = false;
//                 //     console.log('Header is in view.');
//                 // }
//                 scope.$apply();
//             });
//         };
//     });


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

        $http.get("process/blog.php?page=1")
        .then(function (response) {
            $scope.blog = response.data;
            $scope.currentPage = 1; 
            $scope.entryLimit = 5; 
            $scope.filteredItems = $scope.blog.length;
            $scope.totalItems = $scope.blog.length;
            console.log($scope.filteredItems);
            updateiframe();
        });

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.updatePagination = function() {
            let indexFor=[];
            for(var i=0;i<(Math.ceil($scope.filteredItems / $scope.entryLimit));i+=1){
                indexFor.push(i+1);
            }
            return indexFor;
        };

        
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

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
            if($(content).find('p').prevObject!=0){
                return $(content).find('p').prevObject[0].innerText;
            }else{
                return "No Content";
            }
        }
        
	});

    yosApp.controller('blogDetailController', function($scope,$http,yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $http.get("process/blog.php?id="+localStorage.getItem("blog_id")+"&page=2")
        .then(function (response) {
            $scope.blog = response.data[0];
        });
	});

    
	yosApp.controller('aboutController', function($scope) {

	});

    yosApp.controller('portfolioController', function($scope,$window) {
        

        $scope.getoffsetTop = function(object){
            var element = angular.element(document.querySelector('#'+object));
            return element.offset().top-($window.innerHeight-100);
        }

       $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            $scope.scroll=scroll;
            $scope.$apply();
        });

	});

	yosApp.controller('contactController', function($scope) {

	});

// END Angular Section

