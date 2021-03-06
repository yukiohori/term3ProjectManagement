<?php
	session_start();
	if(!isset($_SESSION['userName'])){
		echo '<script>window.location.replace("http://localhost:3000/term3ProjectManagement/dashboard.html")</script>';
	}else{
?>

<div class='admin-blog-style'>
	<h1>ADMIN BLOG PAGE</h1>

	<div class="row admin-blog-list">
		<div class="small-12 medium-12 small-12 column blog-list-style remove-padding" ng-repeat="x in blog">
			<div class="option-list-style-blog">
				<i class="fa fa-2x fa-pencil-square" ng-click="changeContentBlog()" id="demo{{$index}}" aria-hidden="true"></i>
				<i class="fa fa-2x fa-trash" ng-click="deleteBlog()" aria-hidden="true"></i>
			</div>
			<div class="small-12 medium-12 large-12 column">
				<h4 ng-bind="x.blog_title"></h4>
			</div>
			<div class="small-12 medium-12 large-12 column">
				<p ng-bind="x.blog_date"></p>
			</div>
			<div class="show-for-large large-3 column">
				<img ng-src="{{x.blog_img}}" />
			</div>
			<div ng-bind-html="x.blog_content" class="small-12 medium-12 large-9 column">
			</div>
		</div>
	</div>

	<div class="blog-menu-option">
		<div class="option-icon">
			<i ng-click="openBodalBox(1)" class="fa fa-2x fa-plus-circle" aria-hidden="true"></i>
		</div>
		<div class="option-icon">
			<i class="fa fa-2x fa-sign-out" ng-click="yosAppVar.logout()" aria-hidden="true"></i>
		</div>
	</div>

	<div id="modalBox" class="modalbox-bg" ng-class="{'modalbox-show':modalForm}">
		<div class="modalbox-style">
			<form class="about-form-style" ng-submit="submit()">
				<div class="form-close-btn-blog">
					<a class="remove-margin" ng-click="changeTabBlog(1)">Title</a>
					<a class="remove-margin" ng-click="changeTabBlog(2)">Content</a>
					<i ng-click="closeModalBoxForm()" class="fa fa-2x fa-times" aria-hidden="true"></i>
				</div>
				<div class="form-top-bar-about" ></div>
				<div class="about-form-ckediotor" ng-show="blogForm==1">
					<div class="clearfix">
						<h2>New Blog</h2>
						<div class="small-12 medium-12 large-12 column text-center">
							<h4>Title*</h4>
						</div>
						<div class="small-12 medium-12 large-12 column">
							<input ng-model="title" class="text-center" name="blog-title" type="text">
						</div>
						<div class="small-12 medium-12 large-12 column text-center">
							<h4>Category* <i ng-click="showNewCategoryForm()" class="fa fa-plus-circle" aria-hidden="true"></i></h4>
						</div>
						<div class="small-12 medium-12 large-12 column category-form-style" ng-show="newCagegoryForm">
							<span>New Category* : </span>
							<input type="text" id="nameCategory" ng-model="categoryName"><a ng-click="submitCategory()">Add Category</a>
						</div>
						<div class="category-row">
							<div class="small-12 medium-6 large-6 column" ng-repeat="x in category">
								<input ng-change="convertToStringCategories()" type="checkbox" ng-model="x.checkBox" id="category{{x.id}}" /><label for="category{{x.id}}" ng-bind="x.category_name"></label>
							</div>
						</div>
					</div>
				</div>
				<div class="about-form-ckediotor remove-padding" ng-show="blogForm==2">
					<textarea name="blogeditor"></textarea>
				</div>
				<div class="form-about-buttons">
					<input class="form-submit-style" type="submit" value="POST!">
				</div>
			</form>
		</div>
	</div>

	<div id="modalBoxMsg" class="modalbox-bg">
	</div>

	<script>
		var bloged = CKEDITOR.replace( 'blogeditor',{
		resize_enabled: 'false',
		removePlugins: 'elementspath',
		filebrowserUploadUrl: '/term3ProjectManagement/process/upload.php',
		height : '100%',
		image_previewText : CKEDITOR.tools.repeat( 'Select the Image', 1 ),
		toolbar: [
				[ 'Image','Bold', 'Italic', '-', 'NumberedList','BulletedList', '-', 'Link', 'Unlink' ]
			]
		});
		
	</script>
	
</div>
<?php
	}
?>