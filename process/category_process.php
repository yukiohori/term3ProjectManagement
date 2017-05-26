<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        if($_GET['type']==1){
            $query = "SELECT * FROM category_tb ORDER BY category_name DESC";

            $result = mysqli_query($conn,$query);

            while($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
            }
            
            header('Content-type: application/json');
            echo json_encode($rows);
        }else{
            $category = mysqli_real_escape_string($conn, $_POST['catagoryName']);
            $query = "INSERT INTO category_tb (category_name) VALUES ('".$category."')";

            $result = mysqli_query($conn,$query);

            if($result){
                echo "1";
            }else{
                echo "2";
            }
        }
        
        
    }


?>