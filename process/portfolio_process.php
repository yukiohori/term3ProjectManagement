<?php

$config=parse_ini_file("../config.ini");
$conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);
if(!$conn){
    echo "connection failed : ".mysqli_connect_error();
}else{

    $type = mysqli_real_escape_string($conn, $_POST['type']);
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $embed = mysqli_real_escape_string($conn, $_POST['embed']);
    
    if($type==-1){
        // echo $content;
        $s = explode('src=\"',$description);
        for($i=1;$i<count($s);$i+=1){
            $t = explode('\"',$s[$i]);
            unlink("'/".$t[0]."'");
            // echo $t[0];
        }
        $query = "DELETE FROM portfolio_tb WHERE id=".$id;

    }else if($type==0){
        // var_dump($_FILES);
        $firstImage="";
        $otherImage="";
        $passed=false;
        for($i=0;$i<count($_FILES);$i+=1){
            $index = "image".$i;
            if(isset($_FILES[$index])){
                $file_name = $_FILES[$index]['name'];
                $file_name_tmp = $_FILES[$index]['tmp_name'];
                $file_new_name = '../img/portfolio/';
                $full_path = $file_new_name . basename($_FILES[$index]["name"]);
                $http_path = 'img/portfolio/'.basename($_FILES[$index]["name"]);
                if(move_uploaded_file($file_name_tmp, $full_path)){
                    if($i==0){
                        $firstImage=$http_path;
                    }else{
                        $otherImage.=$http_path."@";
                    }
                    $passed=true;
                }else{
                    $passed=false;
                }
            }
        }
        if($passed){
            $otherImage=rtrim($otherImage,'@');
            $title = mysqli_real_escape_string($conn, $_POST['title']);
            $query = "INSERT INTO portfolio_tb (portfolio_title,portfolio_image,portfolio_content, portfolio_image_option, portfolio_embed) VALUES ('".$title."','".$firstImage."','".$description."','".$otherImage."','".$embed."')";
        }
        
    }else{
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $query = "UPDATE portfolio_tb SET portfolio_title='".$title."',portfolio_image='".$image."', portfolio_content='".$description."',portfolio_image_option='".$description."', portfolio_embed='".$embed."' WHERE id=".$id;
    }

    $result = mysqli_query($conn,$query);
    if($result){
        echo "1";
    }else{
        echo "3";
    }
}