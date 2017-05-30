<?php
	session_start();
	if(!isset($_SESSION['userName'])){
		echo '<script>window.location.replace("http://localhost:3000/term3ProjectManagement/dashboard.html")</script>';
	}else{
?>

<div class='login-style'>

	<div class="login-form text-center">
		<h2>Change Password</h2>
		<form ng-submit="changePwd()">
			<div class="clearfix">
				<p ng-bind="error"></p>
			</div>
			<div class="clearfix login-form-flex">
				<div class="small-12 medium-4 large-4 column">
					<label>New Password</label>
				</div>
				<div class="small-12 medium-8 large-8 column">
					<input ng-model="userPwd" type="text" placeholder="type new password"/>
				</div>
			</div>
			<div class="clearfix login-form-flex">
				<div class="small-12 medium-4 large-4 column">
					<label>Retype Password</label>
				</div>
				<div class="small-12 medium-8 large-8 column">
					<td><input ng-model="userPwd2" type="password" placeholder="retype new password"/><td>
				</div>
			<div>
			<div class="clearfix">
				<input type="submit" value="Change Password"/>
			</div>
		</form>
	</div>
	
</div>
<?php
	}
?>