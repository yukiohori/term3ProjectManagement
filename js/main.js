
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
                    // console.log(yosAppVar.getoffsetTop(key));
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
            // console.log(element[0].offsetTop);
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
           section2:false,
           section3:false
       };
       
       $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/home";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/blog.php?type=2")
        .then(function (response) {
            $scope.blog = response.data;
            for(var i=0;i<$scope.blog.length;i+=1){
                $scope.blog[i].categoryNameArray=$scope.blog[i].categoryName.split(',');
            }
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

    yosApp.controller('blogController', function($scope, $http, $location , $window, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        $scope.blogIndex=0;
        yosAppVar.animationState={};

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/blog";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/blog.php?type=1")
        .then(function (response) {
            $scope.blog = response.data;
            $scope.currentPage = 1;
            $scope.entryLimit = 5;
            $scope.filteredItems = $scope.blog.length;
            $scope.totalItems = $scope.blog.length;
            for(var i=0;i<$scope.blog.length;i+=1){
                $scope.blog[i].categoryNameArray=$scope.blog[i].categoryName.split(',');
            }
            // console.log($scope.filteredItems);
            // updateiframe();
        });

        $http.get("process/category_process.php?type=1")
        .then(function (response) {
            console.log(response.data);
            $scope.category = response.data;
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

        $scope.selectBlog=function(){
            localStorage.setItem("blog_id",this.$parent.x.blog_id);
            $scope.yosAppVar.changePage("blog_detail");
        }

        // function updateiframe(){
        //     for(var i=0;i<$scope.blog.length;i+=1){
        //         $scope.blog[i].blog_index=i;
        //         $scope.blog[i].blog_embed=$sce.trustAsHtml($scope.blog[i].blog_embed);
        //         $scope.blog[i].blog_content=$scope.blog[i].blog_content;
        //     }
        // }
        
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

        $http.get("process/about_process.php?type=1")
        .then(function (response) {
            // console.log(response.data[0]);
            $scope.about = response.data[0];
        });

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/about";
            $scope.yosAppVar.changePanel=false;
        });

        $http.get("process/skill.php?type=1")
        .then(function (response) {
            // console.log(response.data);
            $scope.skill = response.data;
        });
	});

    yosApp.controller('portfolioController', function($scope,$http,$window,yosAppVar,$sce) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        $scope.detailModalBox=false;
        $scope.yosAppVar.animationState={};
        $scope.imgSelected="";
        $scope.showMode=0;

        $scope.embedCode="";

        uploadPortfolio();
        
        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/portfolio";
            $scope.yosAppVar.changePanel=false;
        });

        $scope.openDetailPortfolio=(portObj)=>{
            console.log(portObj);
            $scope.imageListPostfolio=[];
            $scope.imageListPostfolio.push(portObj.portfolio_image);
            $scope.imgSelected=portObj.portfolio_image;
            $scope.embedCode="";

            if(portObj.portfolio_image_option!=""){
                let imageMore=portObj.portfolio_image_option.split('@');
                for(var i=0;i<imageMore.length;i+=1){
                    $scope.imageListPostfolio.push(imageMore[i]);
                }
            }

            if(portObj.portfolio_embed!="")
            $scope.embedCode=$sce.trustAsResourceUrl("https://www.artstation.com/embed/"+portObj.portfolio_embed);

            $scope.detailModalBox=true;
        }

        $scope.changeShowMode=(mode)=>{
            
            if(mode==2){
                $scope.showMode=0;
                $scope.detailModalBox=false;
            }else{
                $scope.showMode=mode;
            }
        }

        $scope.selectedImagePort=(src)=>{
            $scope.imgSelected=src;
        }

        function uploadPortfolio(){
            $http.get("process/portfolio.php")
            .then(function (response) {
                console.log(response.data);
                $scope.portfolio = response.data;
                for(var i=0;i<$scope.portfolio.length;i+=1){
                    $scope.portfolio[i].portfolio_index=i;
                    $scope.portfolio[i].moreOption=false;
                    if($scope.portfolio[i].portfolio_embed!=""){
                        $scope.portfolio[i].moreOption=true;
                        $scope.portfolio[i].embedShow=true;
                    }else{
                        $scope.portfolio[i].embedShow=false;
                    }
                    if($scope.portfolio[i].portfolio_image_option!=""){
                        $scope.portfolio[i].moreOption=true;
                        $scope.portfolio[i].multiShow=true;
                    }else{
                        $scope.portfolio[i].multiShow=false;
                    }
                }
            });
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

