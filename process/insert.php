<?php 
    session_start();
    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        $usernm = mysqli_real_escape_string($conn, $_GET['username']);
        $userpw = mysqli_real_escape_string($conn, $_GET['userpw']);

        $userpw = password_hash($userpw,PASSWORD_DEFAULT);

        $query="INSERT INTO user_tb (user_name,user_pwd) VALUES ('".$usernm."','".$userpw."')";

        $result=mysqli_query($conn,$query);

        if($result){
            echo "created!";
        }else{
            echo "failed";
        }
        
        
    }


?>