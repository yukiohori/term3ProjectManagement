<?php 
    session_start();
    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        if(isset($_GET['type'])){
            if(isset($_SESSION['userId'])){
                session_unset();
                session_destroy();
            }
        }else if($_POST['type']==1){
            $usernm = mysqli_real_escape_string($conn, $_POST['username']);
            $userpw = mysqli_real_escape_string($conn, $_POST['passwd']);

            $query = "SELECT * FROM user_tb WHERE user_name='".$usernm."'";

            $result = mysqli_query($conn,$query);

            $rownum=mysqli_num_rows($result);

            if($rownum>0){
                while($row = mysqli_fetch_assoc($result)){

                    $hashed_pwd=$row['user_pwd'];

                    function verify_password_hash($strPassword, $strHash){
                        if (function_exists('password_verify')) {
                            // php >= 5.5
                            $boolReturn = password_verify($strPassword, $strHash);
                        } else {
                            $strHash2 = crypt($strPassword, $strHash);
                            $boolReturn = $strHash == $strHash2;
                        }
                        return $boolReturn;
                    }

                    $match = verify_password_hash($userpw,$hashed_pwd);
                    
                    if($match==0){
                        echo "1Invalid Username and/or Password, Please try again";
                    }else{
                        $_SESSION['userId']=$row['id'];
                        $_SESSION['userName']=$usernm;
                        echo "1";
                    }
                }
            }else{
                echo "2Invalid Username and/or Password, Please try again";
            }
        }else if($_POST['type']==2){
            if(isset($_SESSION['userId'])){

                $id = $_SESSION['userId'];
                $newpasswd = mysqli_real_escape_string($conn, $_POST['passwd']);

                $newpasswd2 = password_hash($newpasswd,PASSWORD_DEFAULT);

                $query="UPDATE user_tb SET user_pwd='".$newpasswd2."' WHERE id=".$id;

                $result=mysqli_query($conn,$query);

                if($result){
                    echo "Password has changed successfully";
                }else{
                    echo "Error, Please contact to Administrator";
                }
            }
        }
    }


?>