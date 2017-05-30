<?php
	session_start();
	if(!isset($_SESSION['userName'])){
		echo '<script>window.location.replace("http://localhost:3000/term3ProjectManagement/dashboard.html")</script>';
	}else{
?>

<div class='admin-portfolio-style'>
	<h1>ADMIN PORTFOLIO PAGE</h1>
	<div class="row admin-portfolio-list">
		<div class="small-12 medium-6 large-4 column portfolio-list-style" ng-repeat="x in filtered = (portfolio)">
			<img ng-src="{{x.portfolio_image}}" />
			<div class="work-detail-desc-admin">
				<!--<i class="fa fa-cube" aria-hidden="true"></i>-->
				<i class="fa fa-pencil-square" ng-click="openBodalBox(x)" aria-hidden="true"></i>
				<i class="fa fa-trash" ng-click="deletePortfolio(x)" aria-hidden="true"></i>
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
			<form class="portfolio-form-style" ng-submit="submit()">
				<div class="close-btn-form" ng-click="closeModalBoxForm()"><i class="fa fa-times" aria-hidden="true"></i></div>
				<div class="form-blog-buttons">
					<input class="form-submit-style" type="submit" value="SUBMIT">
				</div>
				<div class="small-12 medium-12 large-12 column">
					<div class="small-12 medium-6 large-6 column">
						<h4>Title</h4>
						<input ng-model="title" class="text-center" type="text">
						<h4>Description</h4>
						<textarea ng-model="description"></textarea>
					</div>
					<div class="small-12 medium-6 large-6 column text-center">
						<h4>Embed</h4>
						<input ng-model="embed" class="text-center" type="text">
						<div class="file-drop-zone" file-dropzone files-to-upload = "files">
							<span>Click or Drop Image (MAX 3 IMAGES)</span>
						</div>
					</div>
				</div>
				<input type="file" class="set-non-visible upload-class" onchange="angular.element(this).scope().addImage(this)">

				<div class="small-12 medium-12 large-12 column">
					<div class="text-center"><h3>PREVIEW</h3></div>
					<div class="image-container">
						<div class="image-flex" ng-repeat="file in img">
							<div><i ng-click="deleteImageUpdate($index)" class="fa fa-times" aria-hidden="true"></i></div>
							<img ng-src={{file}} />
						</div>
						<div class="image-flex" ng-repeat="file in yosAppVar.images">
							<p ng-click="yosAppVar.removeImages($index)">X</p>
							<img ng-src={{file.preview}} />
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
	
</div>
<?php
	}
?>