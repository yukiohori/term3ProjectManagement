<?php 

    $config=parse_ini_file("../config.ini");
    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        if(isset($_GET['id'])){
            $query = "SELECT * FROM portfolio_tb WHERE id=".$_GET['id'];
        }else{
            $query = "SELECT * FROM portfolio_tb";
        }
        
        $result = mysqli_query($conn,$query);

        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        
        header('Content-type: application/json');
        echo json_encode($rows);
    }


?>