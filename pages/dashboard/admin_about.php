<?php
	session_start();
	if(!isset($_SESSION['userName'])){
		echo '<script>window.location.replace("http://localhost:3000/term3ProjectManagement/dashboard.html")</script>';
	}else{
?>

<div class='admin-about-style'>
	<h1>ADMIN ABOUT PAGE</h1>

	<div class="row about-admin-content">
		<div ng-bind-html="yosAppVar.about.content">
		</div>
		<div class="option-list-style">
			<i class="fa fa-2x fa-pencil-square" ng-click="showAboutForm()" aria-hidden="true"></i>
		</div>
	</div>
	<div class="row skill-box-admin">
		<div class="option-list-style">
			<i class="fa fa-2x fa-pencil-square" ng-click="showSkillForm()" aria-hidden="true"></i>
		</div>
		<div class="home-about-style set-relative remove-padding">
			
			<h2 class="text-center">MY SKILLS</h2>
			<div class=" row skill-form-style" ng-show="skillForm">
				<div class="small-12 medium-4 large-4 column">
					<p>Skill Icon</p>
					<input type="file" onchange="angular.element(this).scope().setIconSkill(this)" name="skill_file" />
				</div>
				<div class="small-12 medium-4 large-4 column">
					<p>Skill Name</p>
					<input type="text" ng-model="skillName"  />
				</div>
				<div class="small-12 medium-4 large-4 column">
					<p>Skill Level</p>
					<input type="text" ng-model="skillLevel"  />
				</div>
				<div class="skill-btn-submit small-12 medium-12 large-12 column text-center">
					<a ng-click="submitSkill(2,0,0)">Add Skill</a>
				</div>
			</div>
			<div class="row about-skill-info" ng-repeat="x in yosAppVar.skill">
				<div ng-click="editFormShow($index)" class="small-1 medium-1 large-1 icon-skill-about column">
					<img ng-src="{{x.skill_icon}}" />
				</div>
				<div class="small-11 medium-11 large-11 column">
					<div class="remove-padding skil-max-bar"  ng-style="{'width':(x.skill_level+'%')}">
						<div class="about-skill-bar-admin">
							<p ng-bind="x.skill_level"></p>
						</div>
					</div>
				</div>
				<div class="small-12 medium-12 large-12 column">
					<div class="row skill-form-style" ng-show="x.skillEdit">
						<div class="small-12 medium-4 large-4 column">
							<p>Skill Icon</p>
							<input type="file" onchange="angular.element(this).scope().setIconSkill(this)" name="skill_file" />
						</div>
						<div class="small-12 medium-4 large-4 column">
							<p>Skill Name</p>
							<input type="text" ng-model="x.skill_name" ng-value="x.skill_name"  />
						</div>
						<div class="small-12 medium-4 large-4 column">
							<p>Skill Level</p>
							<input type="text" ng-model="x.skill_level" ng-value="x.skill_level"  />
						</div>
						<div class="skill-btn-submit small-12 medium-12 large-12 column text-center">
							<a ng-click="submitSkill(3,x.id,$index)">Edit Skill</a><a ng-click="deleteSkill(x.id)">Delete Skill</a>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>

	<div id="modalBox" class="modalbox-bg" ng-class="{'modalbox-show':aboutForm}">
		<div class="modalbox-style">
			<form class="about-form-style" ng-submit="submitAboutContent()">
				<div class="form-close-btn-about"><i ng-click="showAboutForm()" class="fa fa-2x fa-times" aria-hidden="true"></i></div>
				<div class="form-top-bar-about"></div>
				<div class="about-form-ckediotor remove-padding">
					<textarea name="abouteditor"></textarea>
				</div>
				<div class="form-about-buttons">
					<input class="form-submit-style" type="submit" value="EDIT!">
				</div>
			</form>
		</div>
	</div>

	<div id="modalBoxMsg" class="modalbox-bg">
	</div>

	<script>
		var aboutEd = CKEDITOR.replace( 'abouteditor',{
		resize_enabled: 'false',
		removePlugins: 'elementspath',
		height : '100%',
		toolbar: [
				['Bold', 'Italic', 'FontSize','-', 'NumberedList','BulletedList', '-', 'Link', 'Unlink' ]
			]
		});
		
	</script>
	
</div>	
<?php
	}
?>