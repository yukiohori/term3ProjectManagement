<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        if(isset($_GET['id'])){
            $query = "SELECT * FROM blog_tb WHERE id=".$_GET['id'];
        }else{
            if($_GET['type']==1){
                $query = "SELECT *,GROUP_CONCAT(ca.id) as categoryID,GROUP_CONCAT(ca.category_name ) as categoryName  FROM blog_tb b, blogCategory_tb bc, category_tb ca WHERE b.blog_id=bc.blog_id AND bc.category_id=ca.id GROUP BY b.blog_id ORDER BY b.blog_id DESC";
            }else{
                $query = "SELECT * FROM blog_tb ORDER BY id DESC LIMIT 3";
            }
        }
        
        $result = mysqli_query($conn,$query);

        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        
        header('Content-type: application/json');
        echo json_encode($rows);
    }


?>