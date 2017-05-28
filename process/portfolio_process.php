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
        $imageEdit=explode('@',$_POST['imageEdit']);
        $otherImage="";
        if(count($imageEdit)!=0){
            for($i=0;$i<count($imageEdit);$i+=1){
                if($i==0){
                    $firstImage=$imageEdit[0];
                }else{
                    $otherImage.=$imageEdit[$i];
                }
            }
        }

        

        $passed=false;
        if(count($_FILES)!=0){
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
                            if($firstImage!=""){
                                $otherImage.=$http_path."@";
                            }else{
                                $firstImage=$http_path;
                            }
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
                $query = "UPDATE portfolio_tb SET portfolio_title='".$title."',portfolio_image='".$firstImage."', portfolio_image_option='".$otherImage."',portfolio_content='".$description."', portfolio_embed='".$embed."' WHERE id=".$id;
            }
        }else{
            $otherImage=rtrim($otherImage,'@');
            $query = "UPDATE portfolio_tb SET portfolio_title='".$title."',portfolio_image='".$firstImage."', portfolio_image_option='".$otherImage."',portfolio_content='".$description."', portfolio_embed='".$embed."' WHERE id=".$id;
        }
    }

    $result = mysqli_query($conn,$query);
    if($result){
        echo "1";
    }else{
        echo "3";
    }
}