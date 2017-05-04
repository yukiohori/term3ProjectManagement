<?php 

    $config=parse_ini_file("../config.ini");
    // require 'rb.php';
    // R::setup( 'mysql:host=localhost;dbname='.$config["database"],$config["username"],$config["password"]);
    //     $listBlog = R::find('blog_tb');
    //     foreach($listBlog as $val){
    //         echo "<div class='clearfix'>";
    //         echo "<h1>".($val->id)."</div>";
    //         echo "<div><img src='".($val->blog_img)."'  alt='".($val->blog_img)."' /></div>";
    //         echo ($val->blog_content);
    //         echo "</div>";
    //     }
    // R::close();

    $conn=mysqli_connect('localhost',$config["username"],$config["password"],$config["database"]);

    if(!$conn){
        echo "connection failed : ".mysqli_connect_error();
    }else{

        $query = "SELECT * FROM blog_tb";

        $result = mysqli_query($conn,$query);

        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }

        header('Content-type: application/json');
        echo json_encode($rows);
    }


?>