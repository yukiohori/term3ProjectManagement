
// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize','ngAnimate']);

    yosApp.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        }
    });

    yosApp.directive("scroll", function ($window,yosAppVar) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                
                yosAppVar.scroll=this.scrollY;
                for(key in yosAppVar.animationState){
                    console.log(yosAppVar.getoffsetTop(key));
                    if(yosAppVar.scroll>yosAppVar.getoffsetTop(key)){
                        yosAppVar.animationState[key]=true;
                    }else{
                        yosAppVar.animationState[key]=false;
                    }
                }
                
                scope.$apply();
            });
        };
    });

    yosApp.factory('yosAppVar', function ($location,$timeout,$window) {
        var yosAppVar={};
        yosAppVar.menuState=true;
        yosAppVar.menuFooter=true;
        yosAppVar.menuShow=false;
        yosAppVar.changePanel=false;
        yosAppVar.currenctPage=$location.url();
        yosAppVar.blog;
        yosAppVar.scroll=0;
        yosAppVar.animationState={};

        yosAppVar.showMenuBtn = () => {
            yosAppVar.menuShow=!yosAppVar.menuShow;
        }

        yosAppVar.changePage=(dir) => {
            if(yosAppVar.currenctPage!="/"+dir){
                yosAppVar.changePanel=true;
                $timeout(function () {
                    yosAppVar.menuShow=false;
                    $window.scrollTo(0, 0);
                    $location.path("/"+dir);
                }, 1000);
            }
        }

        yosAppVar.getoffsetTop = function(object){
            var element = angular.element(document.querySelector('#'+object));
            console.log(element[0].offsetTop);
            return element[0].offsetTop-($window.innerHeight-100);
        }

        yosAppVar.changePage=(dir)=>{
            if(yosAppVar.currenctPage!="/"+dir){
                yosAppVar.currenctPage="/"+dir;
                yosAppVar.changePanel=true;
                $timeout(function () {
                    yosAppVar.menuShow=false;
                    $window.scrollTo(0, 0);
                    $location.path("/"+dir);
                }, 1000);
            }
        }

        return yosAppVar;
    });

    yosApp.config(function($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
                templateUrl : 'pages/intro.html',
                controller  : 'introController'
            })

            .when('/intro', {
                templateUrl : 'pages/intro.html',
                controller  : 'introController'
            })

            .when('/home', {
                templateUrl : 'pages/home.html',
                controller  : 'homeController'
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

	yosApp.controller('mainController', function($scope, $http, $window, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            $scope.yosAppVar.changePanel=false;
        });
       
	});

    yosApp.controller('homeController', function($scope, $http, $window, yosAppVar) {
       $scope.yosAppVar=yosAppVar;
       $scope.yosAppVar.menuState=true;
       $scope.yosAppVar.menuFooter=true;
       $scope.animateSection1=false;
       $scope.yosAppVar.animationState={
           section1:false,
           section2:false
       };
       
       $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/home";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/blog.php?type=2")
        .then(function (response) {
            $scope.blog = response.data;
        });

	});

    yosApp.controller('introController', function($scope, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=false;
        $scope.yosAppVar.menuFooter=false;
        yosAppVar.animationState={};

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/intro";
            $scope.yosAppVar.changePanel=false;
        });
	});

    yosApp.controller('blogController', function($scope, $http, $location , $sce, $window, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.blogIndex=0;
        yosAppVar.animationState={};

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/blog";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/blog.php?page=1&type=1")
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
            $window.scrollTo(0, 0);
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
            $scope.yosAppVar.changePage("blog_detail");
        }

        // $scope.embed=$sce.trustAsHtml($scope.blog[0].blog_embed);

        function updateiframe(){
            for(var i=0;i<$scope.blog.length;i+=1){
                $scope.blog[i].blog_index=i;
                $scope.blog[i].blog_embed=$sce.trustAsHtml($scope.blog[i].blog_embed);
                $scope.blog[i].blog_content=$scope.blog[i].blog_content;
            }
        }
        
	});

    yosApp.controller('blogDetailController', function($scope,$http,yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        yosAppVar.animationState={};

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/blog_detail";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/blog.php?id="+localStorage.getItem("blog_id")+"&page=2")
        .then(function (response) {
            $scope.blog = response.data[0];
        });
	});

    
	yosApp.controller('aboutController', function($scope, $http, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        yosAppVar.animationState={
            section1:false
        };

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/about";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/skill.php")
        .then(function (response) {
            console.log(response.data);
            $scope.skill = response.data;
        });
	});

    yosApp.controller('portfolioController', function($scope,$window,yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        $scope.yosAppVar.animationState={};
        
        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/portfolio";
            $scope.yosAppVar.changePanel=false;
        });

        $scope.getoffsetTop = function(object){
            var element = angular.element(document.querySelector('#'+object));
            return element[0].offsetTop-($window.innerHeight-100);
        }

	});

	yosApp.controller('contactController', function($scope, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=false;
        $scope.yosAppVar.animationState={};

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/contact";
            $scope.yosAppVar.changePanel=false;
        });
	});

// END Angular Section

