// window.onbeforeunload = function(){
//   return 'Are you sure you want to leave?';
// };

// Angular Section

    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize']);

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

    yosApp.factory('yosAppVar', function ($location,$timeout,$window,$http,$interval) {
        var yosAppVar={};
        yosAppVar.menuState=false;
        yosAppVar.menuFooter=false;
        yosAppVar.menuShow=false;
        yosAppVar.changePanel=false;
        yosAppVar.currenctPage=$location.url();
        yosAppVar.scroll=0;
        yosAppVar.animationState={};
        yosAppVar.interval;

        //about Section
        yosAppVar.about="";
        yosAppVar.skill=[];

        //blog Section
        yosAppVar.blog=[];
        yosAppVar.filteredItems = 0;
        yosAppVar.totalItems = 0;
        yosAppVar.category=[];
        
        //Portfolio Section
        yosAppVar.portfolio=[];
        yosAppVar.portfolioImages=[];

        yosAppVar.showMenuBtn = () => {
            yosAppVar.menuShow=!yosAppVar.menuShow;
        }

        yosAppVar.updateAbout = () => {
            $http.get("process/about_process.php?type=1")
            .then(function (response) {
                yosAppVar.about = response.data[0];
            });
        }

        yosAppVar.updateSkill = () =>{
             $http.get("process/skill.php?type=1")
            .then(function (response) {
                yosAppVar.skill = response.data;
            });
        }

        yosAppVar.updateBlog = () =>{
            $http.get("process/blog.php?type=1")
            .then(function (response) {
                yosAppVar.blog = response.data;
                yosAppVar.filteredItems = yosAppVar.blog.length;
                yosAppVar.totalItems = yosAppVar.blog.length;
                for(var i=0;i<yosAppVar.blog.length;i+=1){
                    yosAppVar.blog[i].categoryNameArray=yosAppVar.blog[i].categoryName.split(',');
                }
            });
        }

        yosAppVar.updateCategory= () =>{
            $http.get("process/category_process.php?type=1")
            .then(function (response) {
                yosAppVar.category = response.data;
            });
        }

        yosAppVar.updatePortfolio = () =>{
            $http.get("process/portfolio.php")
            .then(function (response) {
                yosAppVar.portfolio = response.data;
                for(var i=0;i<yosAppVar.portfolio.length;i+=1){
                    yosAppVar.portfolio[i].portfolio_index=i;
                    yosAppVar.portfolio[i].moreOption=false;
                    if(yosAppVar.portfolio[i].portfolio_embed!=""){
                        yosAppVar.portfolio[i].moreOption=true;
                        yosAppVar.portfolio[i].embedShow=true;
                    }else{
                        yosAppVar.portfolio[i].embedShow=false;
                    }
                    if(yosAppVar.portfolio[i].portfolio_image_option!=""){
                        yosAppVar.portfolio[i].moreOption=true;
                        yosAppVar.portfolio[i].multiShow=true;
                    }else{
                        yosAppVar.portfolio[i].multiShow=false;
                    }
                }
            });
        }


        yosAppVar.getoffsetTop = function(object){
            var element = angular.element(document.querySelector('#'+object));
            if(element[0]!=undefined){
                return element[0].offsetTop-($window.innerHeight-300);
            }else{
                return 0;
            }
        }

        yosAppVar.changePage=(dir)=>{
            $interval.cancel(yosAppVar.interval);
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

	yosApp.controller('mainController', function($scope, $http, $window, yosAppVar,preloader) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            $scope.yosAppVar.changePanel=false;
        });

        $scope.imageLocations = [
        ];

        yosAppVar.updateBlog();
        yosAppVar.updateCategory();
        yosAppVar.updateAbout();
        yosAppVar.updateSkill();
        yosAppVar.updatePortfolio();

        preloader.preloadImages( $scope.imageLocations ).then(
            function handleResolve( imageLocations ) {
                $scope.isLoading = false;
                $scope.isSuccessful = true;
            },
            function handleReject( imageLocation ) {
                $scope.isLoading = false;
                $scope.isSuccessful = false;
            },
            function handleNotify( event ) {
                $scope.percentLoaded = event.percent;
            }
        );
       
	});

    yosApp.controller('homeController', function($scope, $http,$interval, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        $scope.animateSection1=false;
        $scope.yosAppVar.animationState={
            section1:false,
            section2:false,
            section3:false
        };

        $scope.blogIndex=0;
        $scope.blogChange=yosAppVar.blog[$scope.blogIndex];

       
        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            $scope.yosAppVar.changePanel=false;
        });

        $scope.selectBlog=function(){
            localStorage.setItem("blog_id",$scope.blogIndex);
            $scope.yosAppVar.changePage("blog_detail");
        }

        yosAppVar.interval = $interval(function () {
            console.log($scope.blogIndex);
            $scope.blogChange=yosAppVar.blog[$scope.blogIndex];
            $scope.blogIndex+=1;
            if($scope.blogIndex>yosAppVar.blog.length-1){
                $scope.blogIndex=0;
            }
        }, 5000);
	});

    yosApp.controller('introController', function($scope, yosAppVar,preloader ) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=false;
        $scope.yosAppVar.menuFooter=false;
        $scope.yosAppVar.animationState={};

        // $scope.yosAppVar.changePanel=true;

        $scope.isLoading = true;
        $scope.isSuccessful = false;
        $scope.percentLoaded = 0;

        $scope.imageLocations = [
            "img/intro/img1.jpg",
            "img/intro/img3.jpg",
            "img/intro/img4.jpg",
            "img/bg-image3.jpg",
            "img/contact-bg.jpg",
            "img/about/about-bg.png",
            "img/bg-image.jpg",
            "img/bg-image2.jpg",
            "img/portfolio-bg.jpg",
            "img/home/warriorflip.png"
        ];

        $scope.changeLoading=()=>{
            $scope.isSuccessful = !$scope.isSuccessful;
        }

        preloader.preloadImages( $scope.imageLocations ).then(
            function handleResolve( imageLocations ) {
                $scope.isLoading = false;
                $scope.isSuccessful = true;
                console.log('loaded!');
            },
            function handleReject( imageLocation ) {
                $scope.isLoading = false;
                $scope.isSuccessful = false;
            },
            function handleNotify( event ) {
                // $scope.percentLoaded = event.percent;
                // console.info( "Percent loaded:", event.percent );
            }
        );

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            $scope.yosAppVar.changePanel=false;
        });

	});

    yosApp.controller('blogController', function($scope, $http, $location , $window, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        $scope.blogIndex=0;
        $scope.yosAppVar.animationState={};
        $scope.currentPage = 1;
        $scope.entryLimit = 5;
        $scope.filterBlog='';

        $scope.filterSelected = (fil) => {
            $scope.filterBlog=fil;
        }
        
        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/blog";
            $scope.yosAppVar.changePanel=false;
        });

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
            $window.scrollTo(0, 0);
        };

        $scope.updatePagination = function() {
            let indexFor=[];
            for(var i=0;i<(Math.ceil($scope.yosAppVar.filteredItems / $scope.entryLimit));i+=1){
                indexFor.push(i+1);
            }
            return indexFor;
        };
        
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.selectBlog=function(){
            // console.log(this.$parent);
            localStorage.setItem("blog_id",this.$parent.$index);
            $scope.yosAppVar.changePage("blog_detail");
        }
        
	});

    yosApp.controller('blogDetailController', function($scope,$http,$window,$timeout,yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        yosAppVar.animationState={};

        $scope.currentIndex = parseInt(localStorage.getItem("blog_id"));

        $scope.blogDetail=$scope.yosAppVar.blog[$scope.currentIndex];

        updatePreviousNext();

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/blog_detail";
            $scope.yosAppVar.changePanel=false;
        });

        $scope.nextPage = () => {
            $scope.currentIndex=$scope.currentIndex-1;
            localStorage.setItem("blog_id",$scope.currentIndex);
            yosAppVar.changePanel=true;
            $timeout(function () {
                yosAppVar.changePanel=false;
                $window.scrollTo(0, 0);
                $scope.blogDetail=$scope.yosAppVar.blog[$scope.currentIndex];
                updatePreviousNext();
            }, 1000);
        }

        $scope.previousPage = () => {
            $scope.currentIndex=$scope.currentIndex+1;
            localStorage.setItem("blog_id",$scope.currentIndex);
            yosAppVar.changePanel=true;
            $timeout(function () {
                yosAppVar.changePanel=false;
                $window.scrollTo(0, 0);
                $scope.blogDetail=$scope.yosAppVar.blog[$scope.currentIndex];
                updatePreviousNext();
            }, 1000);
        }


        function updatePreviousNext(){
            if($scope.currentIndex==0){
                $scope.nextBlog=false;
                $scope.PreviousBlog=true;
            }else if($scope.currentIndex==($scope.yosAppVar.blog.length-1)){
                $scope.nextBlog=true;
                $scope.PreviousBlog=false;
            }else{
                $scope.nextBlog=true;
                $scope.PreviousBlog=true;
            }
        }

	});
    
	yosApp.controller('aboutController', function($scope, $http, yosAppVar) {
        $scope.yosAppVar=yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.yosAppVar.menuFooter=true;
        yosAppVar.animationState={
            section1:false,
            section2:false
        };

        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/about";
            $scope.yosAppVar.changePanel=false;
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
        $scope.titlePort="";
        $scope.ContentPort="";
        
        $scope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            yosAppVar.currenctPage="/portfolio";
            $scope.yosAppVar.changePanel=false;
        });

        $scope.openDetailPortfolio=(portObj)=>{
            console.log(portObj);
            $scope.imageListPostfolio=[];
            $scope.imageListPostfolio.push(portObj.portfolio_image);
            $scope.imgSelected=portObj.portfolio_image;
            $scope.titlePort=portObj.portfolio_title;
            $scope.ContentPort=portObj.portfolio_content;
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

    yosApp.factory(
            "preloader",
            function( $q, $rootScope ) {
                function Preloader( imageLocations ) {
                    this.imageLocations = imageLocations;
                    this.imageCount = this.imageLocations.length;
                    this.loadCount = 0;
                    this.errorCount = 0;

                    this.states = {
                        PENDING: 1,
                        LOADING: 2,
                        RESOLVED: 3,
                        REJECTED: 4
                    };

                    this.state = this.states.PENDING;
                    this.deferred = $q.defer();
                    this.promise = this.deferred.promise;
                }

                Preloader.preloadImages = function( imageLocations ) {
                    var preloader = new Preloader( imageLocations );
                    return( preloader.load() );
                };

                Preloader.prototype = {
                    constructor: Preloader,

                    isInitiated: function isInitiated() {
                        return( this.state !== this.states.PENDING );
                    },
                    isRejected: function isRejected() {
                        return( this.state === this.states.REJECTED );
                    },

                    isResolved: function isResolved() {
                        return( this.state === this.states.RESOLVED );
                    },
                    load: function load() {

                        if ( this.isInitiated() ) {
                            return( this.promise );
                        }
                        this.state = this.states.LOADING;
                        for ( var i = 0 ; i < this.imageCount ; i++ ) {
                            this.loadImageLocation( this.imageLocations[ i ] );
                        }

                        return( this.promise );
                    },

                    handleImageError: function handleImageError( imageLocation ) {
                        this.errorCount++;

                        if ( this.isRejected() ) {
                            return;
                        }
                        this.state = this.states.REJECTED;
                        this.deferred.reject( imageLocation );
                    },

                    handleImageLoad: function handleImageLoad( imageLocation ) {
                        this.loadCount++;
                        if ( this.isRejected() ) {
                            return;
                        }
                        this.deferred.notify({
                            percent: Math.ceil( this.loadCount / this.imageCount * 100 ),
                            imageLocation: imageLocation
                        });

                        if ( this.loadCount === this.imageCount ) {
                            this.state = this.states.RESOLVED;
                            this.deferred.resolve( this.imageLocations );
                        }
                    },

                    loadImageLocation: function loadImageLocation( imageLocation ) {
                        var preloader = this;

                        var image = $( new Image() )
                            .load(
                                function( event ) {

                                    $rootScope.$apply(
                                        function() {
                                            preloader.handleImageLoad( event.target.src );

                                            preloader = image = event = null;
                                        }
                                    );
                                }
                            )
                            .error(
                                function( event ) {

                                    $rootScope.$apply(
                                        function() {
                                            preloader.handleImageError( event.target.src );
                                            preloader = image = event = null;
                                        }
                                    );
                                }
                            )
                            .prop( "src", imageLocation )
                        ;
                    }
                };
                return( Preloader );
            }
        );

// END Angular Section

