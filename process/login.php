<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{
        // echo "conected!";
        // echo var_dump($_POST);

        $usernm = mysqli_real_escape_string($conn, $_POST['username']);
        $userpw = mysqli_real_escape_string($conn, $_POST['passwd']);

        $query = "SELECT * FROM user_tb WHERE user_name='".$usernm."'";

        $result = mysqli_query($conn,$query);

        $rownum=mysqli_num_rows($result);

        if($rownum>0){
			while($row = mysqli_fetch_assoc($result)){
				
				$hashed_pwd=$row['user_pwd'];

				$match = password_verify($userpw,$hashed_pwd);
				
				if($match==0){
					echo "1Invalid Username and/or Password, Please try again";
				}else{
					echo "1";
				}
			}
        }else{
			echo "Invalid Username and/or Password, Please try again";
		}
    }


?>