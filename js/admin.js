
// Angular Section
(function(){
    'use strict';
    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize','ngAnimate']);

    yosApp.factory('yosAppVar', function ($location, $window) {
        var yosAppVar={};
        yosAppVar.menuState=false;
        yosAppVar.menuActive=false;
        yosAppVar.currenctPage="";
        yosAppVar.images=[];

        yosAppVar.openShowMenu = function(){
            yosAppVar.menuActive=!yosAppVar.menuActive;
        };

        yosAppVar.goHomepage = function(){
            window.location.href = "index.html";
        };

        yosAppVar.goBlogAdmin = function(){
            yosAppVar.menuActive=false;
            $location.path("/blog");
            $window.scrollTo(0, 0);
        };

        yosAppVar.goPortfolioAdmin = function(){
            yosAppVar.menuActive=false;
            $location.path("/portfolio");
            $window.scrollTo(0, 0);
        };

        yosAppVar.goAboutAdmin = function(){
            yosAppVar.menuActive=false;
            $location.path("/about");
            $window.scrollTo(0, 0);
        };

        yosAppVar.goChangePassAdmin = function(){
            yosAppVar.menuActive=false;
            $location.path("/change");
            $window.scrollTo(0, 0);
        };

        yosAppVar.logout= function(){
            $location.path("/login");
        };

        return yosAppVar;
    });

    yosApp.directive('fileDropzone', function(yosAppVar) {
        return {
            restrict: 'A',
            scope: {
                filesToUpload: '='
            },
            link : function(scope, element, attrs) {

                element.bind('dragover',function(e){
                    if(e != null){
                        e.preventDefault();
                    }
                     (e.originalEvent || e).dataTransfer.effectAllowed ='copy';
                    element.attr('class','file-drop-zone-over');
                });

                element.bind('dragenter',function(e){
                    if(e != null){
                        e.preventDefault();
                    }
                    (e.originalEvent || e).dataTransfer.effectAllowed = 'copy';
                    element.attr('class','file-drop-zone-over');
                });

                element.bind('click',function(e){
                    angular.element(document.querySelector('.upload-class'))[0].click();
                });
                
                element.bind('drop',function(e){
                    element.attr('class','file-drop-zone');
                    if(e != null){
                        e.preventDefault();
                    }
                    
                    
                    angular.forEach((e.originalEvent || e).dataTransfer.files,function(file){

                        var reader = new  FileReader();
                        reader.onload = function(e) {
                            scope.$apply(function(){
                                var image_source = e.target.result;
                                var image_name = file.name;

                                var fileObject = {
                                    file: file,
                                    name: image_name,
                                    preview: image_source
                                }
                                yosAppVar.images.push(fileObject);
                            });
                        }
                        reader.readAsDataURL(file);
                    });
                });
            }
        }
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

            .when('/portfolio', {
                templateUrl : 'pages/dashboard/admin_portfolio.html',
                controller  : 'adminPortfolioController'
            })

            .when('/about', {
                templateUrl : 'pages/dashboard/admin_about.html',
                controller  : 'adminAboutController'
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
        $scope.id=0;
        $scope.title="";
        $scope.content="";
        $scope.img="";
        $scope.type=0;
        $scope.modalForm=false;
        $scope.blogForm=1;
        // localStorage.setItem("admin_blog",1);

        uploadBlog();

        $scope.submit = () => {
            // console.log($(bloged.getData()).find('img').length);
            if($(bloged.getData()).find('img').length==0){
                $scope.img='img/no-image.png';
            }else{
                $scope.img=$(bloged.getData()).find('img').eq(0).attr('src');
            }

	      	$http({
			  method  : 'POST',
			  url     : 'process/blog_process.php',
			  processData: false,
			  transformRequest: function (data) {

			      var formData = new FormData();
                  formData.append("type", $scope.type);
                  formData.append("id", $scope.id);
                  formData.append("image", $scope.img);
                  formData.append("title", $scope.title);
                  formData.append("content", bloged.getData());
			      return formData;

			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                uploadBlog();
                $scope.modalForm=false;
            });
        };

        $scope.openBodalBox= function(newBlog){
            if(newBlog==1){
                $scope.type=0;
                $scope.title="";
            }
            $scope.modalForm=true;
        };

        $scope.changeTabBlog = (tabNum) =>{
            $scope.blogForm=tabNum;
        }

        $scope.closeModalBoxForm = () =>{
            $scope.modalForm=false;
        }

        $scope.deleteBlog = function(index){
            $scope.id=$scope.blog[index].id;
            $scope.content=$scope.blog[index].blog_content;
            $http({
			  method  : 'POST',
			  url     : 'process/blog_process.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("type", -1);
                  formData.append("id", $scope.id);
                  formData.append("content",$scope.content );
			      return formData;  
			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                console.log(responce.data);
                uploadBlog();
            });
        };

        $scope.changeContentBlog = function(index){
            $scope.id=$scope.blog[index].id;
            $scope.type=1;
            $scope.title=$scope.blog[index].blog_title;
            bloged.setData($scope.blog[index].blog_content);
            $scope.modalForm=true;
        }

        function uploadBlog(){
            $scope.indexBlog=0;
            $http.get("process/blog.php?type=1")
            .then(function (response) {
                console.log(response.data);
                $scope.blog = response.data;
                for(var i=0;i<$scope.blog.length;i+=1){
                    $scope.blog[i].blog_index=i;
                }
            });
        }
	});

    yosApp.controller('adminAboutController', function($scope, $http, $sce,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.aboutForm=false;

        $http.get("process/about_process.php?type=1")
        .then(function (response) {
            $scope.about = response.data[0];
        });

        $scope.showAboutForm = () =>{
            if(!$scope.aboutForm)
            aboutEd.setData($scope.about.content);

            $scope.aboutForm=!$scope.aboutForm;
        }

	});


    yosApp.controller('adminController', function($scope,yosAppVar,$timeout) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
		
        $timeout(function () {
             $scope.yosAppVar.menuActive=true;
        }, 2000);

	});

    yosApp.controller('adminPortfolioController', function($scope,$http,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.type=0;
        $scope.title="";
        $scope.description="";
        $scope.embed="";
        $scope.id=0;
        $scope.img="";

        uploadPortfolio();

        $scope.addImage=function(element){
            // console.log(element.files[0]);
            var reader = new  FileReader();
            reader.onload = function(event) {
                $scope.$apply(function($scope){
                    var image_source = event.target.result;
                    var image_name = element.files[0].name;

                    var fileObject = {
                        file: element.files[0],
                        name: image_name,
                        preview: image_source
                    }
                    $scope.yosAppVar.images.push(fileObject);
                });
            }
            reader.readAsDataURL(element.files[0]);
        }

        $scope.openBodalBox= function(newPort){
            if(newPort==1){
                $scope.type=0;
                $scope.description="";
            }
            $scope.modalForm=true;
        };

        $scope.closeModalBoxForm = () =>{
            $scope.modalForm=false;
        }

        $scope.submit = () => {
            if($scope.yosAppVar.images.length>0){
                $scope.img=$scope.yosAppVar.images[0];
                console.log($scope.img);
            }

	      	$http({
			  method  : 'POST',
			  url     : 'process/portfolio_process.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append('type', $scope.type);
                  formData.append('id', $scope.id);
                  formData.append('image', $scope.img.file);
                  formData.append('title', $scope.title);
                  formData.append('description', $scope.description);
                  formData.append('embed',$scope.embed);
			      return formData;
			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                console.log(responce);
                uploadPortfolio();
                $scope.modalForm=false;
            });
        };

        function uploadPortfolio(){
            $http.get("process/portfolio.php")
            .then(function (response) {
                console.log(response.data);
                $scope.portfolio = response.data;
                for(var i=0;i<$scope.portfolio.length;i+=1){
                    $scope.portfolio[i].portfolio_index=i;
                }
            });
        }
	});

}).call(this);
    