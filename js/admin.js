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

        yosAppVar.closeBodalBox= function(){
            $('#modalBox').fadeOut();
        };

        yosAppVar.openBodalBoxMsg= function(){
            $('#modalBoxMsg').fadeIn();
        };

        yosAppVar.closeBodalBoxMsg= function(){
            $('#modalBoxMsg').fadeOut();
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

            .when('/portfolio', {
                templateUrl : 'pages/dashboard/admin_portfolio.html',
                controller  : 'adminPortfolioController'
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
        $scope.id=0;
        $scope.title="";
        $scope.content="";
        $scope.img="";
        $scope.type=0;
        $scope.blogForm=1;
        localStorage.setItem("admin_blog",1);

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
                $scope.yosAppVar.closeBodalBox();
            });
        };

        $scope.openBodalBox= function(newBlog){
            if(newBlog==1){
                $scope.type=0;
                $scope.title="";
                bloged.setData('');
            }
            $('#modalBox').fadeIn();
        };

        $scope.changeTabBlog = (tabNum) =>{
            $scope.blogForm=tabNum;
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
            $scope.openBodalBox(0);
        }

        function uploadBlog(){
            $scope.indexBlog=0;
            $http.get("process/blog.php")
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