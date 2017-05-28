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
        $query = "DELETE FROM blog_tb WHERE blog_id=".$id;
        if (mysqli_query($conn, $query)) {
             $query = "DELETE FROM blogCategory_tb WHERE blog_id=".$id;
             if (mysqli_query($conn, $query)) {
                echo "1";
            }
        }

    }else if($type==0){
        $mydate=getdate(date("U"));
        $date = $mydate[weekday].",". $mydate[month]." ".$mydate[mday].", ".$mydate[year];
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $image = mysqli_real_escape_string($conn, $_POST['image']);
        $query = "INSERT INTO blog_tb (blog_title,blog_date,blog_img,blog_content) VALUES ('".$title."','".$date."','".$image."','".$content."')";
            
        if (mysqli_query($conn, $query)) {
            $last_id = mysqli_insert_id($conn);
            $categories = explode(',',$_POST['categories']);
            for($i=0;$i<count($categories);$i+=1){
                $query = "INSERT INTO blogCategory_tb (blog_id,category_id) VALUES (".$last_id.",".$categories[$i].")";
                mysqli_query($conn, $query);
            }
            echo "1";
        }else{
            echo "3";
        }
            
    }else{
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $image = mysqli_real_escape_string($conn, $_POST['image']);
        $query = "UPDATE blog_tb SET blog_title='".$title."', blog_img='".$image."', blog_content='".$content."' WHERE blog_id=".$id;

        $result = mysqli_query($conn,$query);
        if($result){
            $categories = explode(',',$_POST['categories']);
            $query = "DELETE FROM blogCategory_tb WHERE blog_id=".$id;

            if(mysqli_query($conn, $query)){
                for($i=0;$i<count($categories);$i+=1){
                    $query = "INSERT INTO blogCategory_tb (blog_id,category_id) VALUES (".$id.",".$categories[$i].")";
                    mysqli_query($conn, $query);
                }
                echo "1";
            }
        }else{
            echo "3";
        }
    }

    
}