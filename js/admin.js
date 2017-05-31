
// Angular Section
(function(){
    'use strict';
    var yosApp = angular.module('yosapp', ['ngRoute','ngSanitize']);

    yosApp.factory('yosAppVar', function ($location, $window,$http) {
        var yosAppVar={};
        yosAppVar.menuState=false;
        yosAppVar.menuActive=false;
        yosAppVar.currenctPage="";
        yosAppVar.images=[];
        yosAppVar.about="";
        yosAppVar.skill=[];

        yosAppVar.openShowMenu = function(){
            yosAppVar.menuActive=!yosAppVar.menuActive;
        };

        yosAppVar.removeImages = function(index){
            var images=[];
            angular.forEach(yosAppVar.images,function(file,key){
                if(index!=key){
                    images.push(file);
                }
            });
            yosAppVar.images=images;
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
            $location.path("/changepwd");
            $window.scrollTo(0, 0);
        };

        yosAppVar.logout = function(){
            $http.get("process/login.php?type=-1")
            .then(function (response) {
                $location.path("/login");
            });
        };

        yosAppVar.updateAbout = function(){
            $http.get("process/about_process.php?type=1")
            .then(function (response) {
                yosAppVar.about = response.data[0];
            });
        }

        yosAppVar.updateSkill = function(){
            $http.get("process/skill.php?type=1")
            .then(function (response) {
                yosAppVar.skill = response.data;
                for(var i=0;i<yosAppVar.skill.length;i+=1){
                    yosAppVar.skill[i].skillEdit=false;
                }
            });
        }

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
                templateUrl : 'pages/dashboard/admin.php',
                controller  : 'adminController'
            })

            .when('/blog', {
                templateUrl : 'pages/dashboard/admin_blog.php',
                controller  : 'adminBlogController'
            })

            .when('/changepwd', {
                templateUrl : 'pages/dashboard/changepwd.php',
                controller  : 'changepwdController'
            })

            .when('/portfolio', {
                templateUrl : 'pages/dashboard/admin_portfolio.php',
                controller  : 'adminPortfolioController'
            })

            .when('/about', {
                templateUrl : 'pages/dashboard/admin_about.php',
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

            $http({
                method  : 'POST',
                url     : 'process/login.php',
                processData: false,
                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("type", 1);
                    formData.append("username", $scope.userName);
                    formData.append("passwd", $scope.userPwd);
                    return formData;

                }, 
                data : $scope.form,
                headers: {
                        'Content-Type': undefined
                }
            }).then(function(response){
                console.log(response.data);
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
        $scope.newCagegoryForm=false;
        $scope.categories = [];

        updateBlog();
        updateCategories();

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
                  formData.append("categories", convertToStringCategories());
			      return formData;

			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                updateBlog();
                $scope.modalForm=false;
            });
        };

        $scope.submitCategory = () => {
	      	$http({
			  method  : 'POST',
			  url     : 'process/category_process.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("catagoryName", $scope.categoryName);
			      return formData;
			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                updateCategories();
                $scope.newCagegoryForm=false;
                $scope.categoryName="";
            });
        };

        $scope.openBodalBox= function(newBlog){
            if(newBlog==1){
                resetCategories();
                $scope.type=0;
                $scope.title="";
            }
            $scope.modalForm=true;
        };

        $scope.changeTabBlog = (tabNum) =>{
            $scope.blogForm=tabNum;
        }

        $scope.showNewCategoryForm = () => {
            $scope.newCagegoryForm=!$scope.newCagegoryForm;
        }

        $scope.closeModalBoxForm = () =>{
            $scope.modalForm=false;
        }

        $scope.deleteBlog = function(){
            $scope.id=this.x.blog_id;
            $http({
			  method  : 'POST',
			  url     : 'process/blog_process.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("type", -1);
                  formData.append("id", $scope.id);
			      return formData;  
			  },
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                updateBlog();
            });
        };

        $scope.changeContentBlog = function(){
            $scope.id=this.x.blog_id;
            $scope.type=1;
            $scope.title=this.x.blog_title;
            bloged.setData(this.x.blog_content);
            
            var catList=this.x.categoryID.split(',');
            resetCategories();
            for(var i=0;i<catList.length;i+=1){
                for(var j=0;j<$scope.category.length;j+=1){
                    if($scope.category[j].id==catList[i]){
                        $scope.category[j].checkBox=true;
                    }
                }
            }
            $scope.modalForm=true;
        }

        function updateBlog(){
            $scope.indexBlog=0;
            $http.get("process/blog.php?type=1")
            .then(function (response) {
                console.log(response.data);
                if(response.data[0]!="1"){
                    $scope.blog = response.data;
                }

                
            });
        }

        function resetCategories(){
            for(var j=0;j<$scope.category.length;j+=1){
                $scope.category[j].checkBox=false;
            }
        }

        function updateCategories(){
            $http.get("process/category_process.php?type=1")
            .then(function (response) {
                $scope.category = response.data;
                for(var i=0;i<$scope.category.length;i+=1){
                    $scope.category[i].checkBox = false;
                }
            });
        }

        function convertToStringCategories(){
            let sCategories="";
            for(var i=0;i<$scope.category.length;i+=1){
                if($scope.category[i].checkBox==true){
                    sCategories+=$scope.category[i].id+",";
                }
            }
            if(sCategories.charAt(sCategories.length - 1)==","){
                sCategories=sCategories.substring(0, sCategories.length-1);
            }
            return sCategories;
        }

	});

    yosApp.controller('adminAboutController', function($scope, $http, $sce,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.aboutForm=false;
        $scope.skillForm=false;
        $scope.skillIcon=null;
        $scope.skillName="";
        $scope.skillLevel="";
        $scope.type=0;

        $scope.yosAppVar.updateAbout();
        $scope.yosAppVar.updateSkill();
        

        $scope.showAboutForm = () => {
            if(!$scope.aboutForm)
            aboutEd.setData($scope.yosAppVar.about.content);

            $scope.aboutForm=!$scope.aboutForm;
        }

        $scope.showSkillForm = () => {
            for(var i=0;i<$scope.yosAppVar.skill.length;i+=1){
                $scope.yosAppVar.skill[i].skillEdit=false;
            }
            $scope.skillForm=!$scope.skillForm;
            if($scope.skillForm)
            $scope.type=2;
        }

        $scope.submitAboutContent = () => {
	      	$http({
			  method  : 'POST',
			  url     : 'process/about_process.php?type=2',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("content", aboutEd.getData());
			      return formData;
			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
               $scope.yosAppVar.updateAbout();
               $scope.aboutForm=false;
            });
        };

        $scope.submitSkill = (number,id,index) => {
            $scope.type = number;
            $scope.skillIconFlag=0;
            if($scope.skillIcon!=null){
                $scope.skillIconFlag=1;
                $scope.skillIcon=$scope.skillIcon[0];
            }

            if(number==3){
                $scope.skillName=$scope.yosAppVar.skill[index].skill_name;
                $scope.skillLevel=$scope.yosAppVar.skill[index].skill_level;
            }
	      	$http({
			  method  : 'POST',
			  url     : 'process/skill.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("type", $scope.type);
                  formData.append("id", id);
                  formData.append("skillIcon", $scope.skillIcon);
                  formData.append("skillIconFlag", $scope.skillIconFlag);
                  formData.append("skillName", $scope.skillName);
                  formData.append("skillLevel", $scope.skillLevel);
			      return formData;
			  },
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                $scope.skillName="";
                $scope.skillLevel="";
                $scope.skillIcon=null;
                $scope.yosAppVar.updateSkill();
            });
        };

        $scope.deleteSkill = (index) => {
	      	$http({
			  method  : 'POST',
			  url     : 'process/skill.php',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
                  formData.append("type", 4);
                  formData.append("id", index);
			      return formData;
			  },
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                $scope.yosAppVar.updateSkill();
            });
        };

        $scope.editFormShow=(index)=>{
            $scope.skillForm=false;
            $scope.skillIcon=null;
            if($scope.yosAppVar.skill[index].skillEdit){
                $scope.yosAppVar.skill[index].skillEdit=false;
            }else{
                for(var i=0;i<$scope.yosAppVar.skill.length;i+=1){
                    $scope.yosAppVar.skill[i].skillEdit=false;
                }
                $scope.yosAppVar.skill[index].skillEdit=true;
            }
            
           
        }

        $scope.setIconSkill=(element)=>{
            $scope.$apply(function($scope) {
                $scope.skillIcon=element.files;    
            });
        }

	});

    yosApp.controller('adminController', function($scope,yosAppVar,$timeout) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
		
        // $timeout(function () {
        //      $scope.yosAppVar.menuActive=true;
        // }, 2000);

	});

    yosApp.controller('changepwdController', function($scope,yosAppVar,$http) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
		
        $scope.userPwd="";
        $scope.userPwd2="";
        $scope.error="";

        $scope.changePwd = function(){

            if($scope.userPwd!=$scope.userPwd2){
                $scope.error="Passwords are not the same";
            }else{
                $http({
                    method  : 'POST',
                    url     : 'process/login.php',
                    processData: false,
                    transformRequest: function (data) {

                        var formData = new FormData();
                        formData.append("type", 2);
                        formData.append("passwd", $scope.userPwd);
                        return formData;

                    }, 
                    data : $scope.form,
                    headers: {
                            'Content-Type': undefined
                    }
                }).then(function(response){
                    $scope.error=response.data;
                    $scope.yosAppVar.logout();
                });
            }
        };
	});

    yosApp.controller('adminPortfolioController', function($scope,$http,yosAppVar) {
        $scope.yosAppVar = yosAppVar;
        $scope.yosAppVar.menuState=true;
        $scope.type=0;
        $scope.title="";
        $scope.description="";
        $scope.embed="";
        $scope.id=0;
        $scope.img=[];

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
                $scope.embed="";
                $scope.img=[];
                $scope.yosAppVar.images=[];
            }else{
                $scope.img=[];
                $scope.id=newPort.id;
                $scope.type=1;
                $scope.title=newPort.portfolio_title;
                $scope.description=newPort.portfolio_content;
                $scope.embed=newPort.portfolio_embed;
                $scope.img.push(newPort.portfolio_image);
                if(newPort.portfolio_image_option!=""){
                    for(var i=0;i<newPort.portfolio_image_option.split('@').length;i+=1){
                        $scope.img.push(newPort.portfolio_image_option.split('@')[i]);
                    }
                }
                $scope.yosAppVar.images=[];
                // $scope.img.
            }
            $scope.modalForm=true;
        };

        $scope.deleteImageUpdate=(index)=>{
            let upImage=[];
            for(var i=0;i<$scope.img.length;i+=1){
                if(i!=index){
                    upImage.push($scope.img[i]);
                }
            }
            $scope.img=upImage;
        }

        $scope.closeModalBoxForm = () => {
            $scope.modalForm=false;
        }

        $scope.submit = () => {
	      	$http({
			  method  : 'POST',
			  url     : 'process/portfolio_process.php',
			  processData: false,
			  transformRequest: function (data) {
                var formData = new FormData();
                formData.append('type', $scope.type);
                formData.append('id', $scope.id);
                angular.forEach($scope.yosAppVar.images,function(file,key){
                    var imageObj = 'image'+ key;
                    formData.append(imageObj, file.file);
                });
                formData.append('imageEdit', $scope.img.join('@'));
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
                console.log(responce.data);
                uploadPortfolio();
                $scope.modalForm=false;
            });
        };

        $scope.deletePortfolio = (index) => {
	      	$http({
			  method  : 'POST',
			  url     : 'process/portfolio_process.php',
			  processData: false,
			  transformRequest: function (data) {
                var formData = new FormData();
                formData.append('type', -1);
                formData.append('id', index.id);
                return formData;
			  }, 
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
            }).then((responce) => {
                uploadPortfolio();
                $scope.modalForm=false;
            });
        };

        function uploadPortfolio(){
            $http.get("process/portfolio.php")
            .then(function (response) {
                $scope.portfolio = response.data;
            });
        }
	});

}).call(this);
    