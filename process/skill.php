<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{
        if(isset($_GET["type"])){
            if($_GET["type"]==1){
                $query = "SELECT * FROM skill_tb";
            
                $result = mysqli_query($conn,$query);

                while($r = mysqli_fetch_assoc($result)) {
                    $rows[] = $r;
                }
                
                header('Content-type: application/json');
                echo json_encode($rows);
            }
        }else if($_POST["type"]==2){
            $file_name = $_FILES['skillIcon']['name'];
            $file_name_tmp = $_FILES['skillIcon']['tmp_name'];
            $file_new_name = '../img/about/skill/';
            $full_path = $file_new_name . basename($_FILES["skillIcon"]["name"]);
            $http_path = 'img/about/skill/'.basename($_FILES["skillIcon"]["name"]);
            
            $name = mysqli_real_escape_string($conn, $_POST['skillName']);
            $level = mysqli_real_escape_string($conn, $_POST['skillLevel']);

            if(move_uploaded_file($file_name_tmp, $full_path)){
                $query = "INSERT INTO skill_tb (skill_name,skill_icon,skill_level) VALUES ('".$name."','".$http_path."','".$level."')";
                
                $result = mysqli_query($conn,$query);
                if($result){
                    echo "1";
                }else{
                    echo "3";
                }

            }else{
                echo "upload failed";
            }
        }else if($_POST["type"]==3){

            $id = mysqli_real_escape_string($conn, $_POST['id']);
            $name = mysqli_real_escape_string($conn, $_POST['skillName']);
            $level = mysqli_real_escape_string($conn, $_POST['skillLevel']);

            
            if($_POST['skillIconFlag']=='1'){
                $file_name = $_FILES['skillIcon']['name'];
                $file_name_tmp = $_FILES['skillIcon']['tmp_name'];
                $file_new_name = '../img/about/skill/';
                $full_path = $file_new_name . basename($_FILES["skillIcon"]["name"]);
                $http_path = 'img/about/skill/'.basename($_FILES["skillIcon"]["name"]);

                if(move_uploaded_file($file_name_tmp, $full_path)){
                    $query = "UPDATE skill_tb SET skill_name='".$name."' ,skill_icon='".$http_path."' ,skill_level='".$level."' WHERE id=".$id;
                    
                    $result = mysqli_query($conn,$query);
                    if($result){
                        echo "1";
                    }else{
                        echo "3";
                    }

                }else{
                    echo "upload failed";
                }
            }else{
                $query = "UPDATE skill_tb SET skill_name='".$name."' ,skill_level='".$level."' WHERE id=".$id;
                echo $query;
                $result = mysqli_query($conn,$query);
                if($result){
                    echo "1-1";
                }else{
                    echo "3";
                }
            }
            
        }else if($_POST["type"]==4){
            $id = mysqli_real_escape_string($conn, $_POST['id']);
            $query = "DELETE FROM skill_tb WHERE id=".$id;
            $result = mysqli_query($conn,$query);
            if($result){
                echo "1";
            }else{
                echo "3";
            }

        }
        
    }


?>