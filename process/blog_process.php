<?php

$config=parse_ini_file("../config.ini");
$conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);
if(!$conn){
    echo "connection failed : ".mysqli_connect_error();
}else{

    $type = mysqli_real_escape_string($conn, $_POST['type']);
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $content = mysqli_real_escape_string($conn, $_POST['content']);
    
    if($type==-1){
          
        // echo $content;
        $s = explode('src=\"',$content);
        for($i=1;$i<count($s);$i+=1){
            $t = explode('\"',$s[$i]);
            unlink("'/".$t[0]."'");
            // echo $t[0];
        }
        $query = "DELETE FROM blog_tb WHERE id=".$id;

    }else if($type==0){
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $image = mysqli_real_escape_string($conn, $_POST['image']);
        $query = "INSERT INTO blog_tb (blog_title,blog_date,blog_img,blog_content,blog_embed) 
            VALUES ('".$title."','date','".$image."','".$content."','embed')";
    }else{
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $image = mysqli_real_escape_string($conn, $_POST['image']);
        $query = "UPDATE blog_tb SET blog_title='".$title."', blog_img='".$image."', blog_content='".$content."', blog_embed='embed' WHERE id=".$id;
    }

    $result = mysqli_query($conn,$query);
    if($result){
        echo "1";
    }else{
        echo "3";
    }
}