<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        $query = "SELECT * FROM skill_tb";
        
        $result = mysqli_query($conn,$query);

        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        
        header('Content-type: application/json');
        echo json_encode($rows);
    }


?>