<?php
header('Access-Control-Allow-Origin: *');
function getData($mysqli): array
{
    $myArray = array();
    $stmt = $mysqli->prepare("SELECT * FROM water");
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_array(MYSQLI_ASSOC)) {
        $myArray[] = $row;
    }
    $stmt->close();
    return $myArray;
}
$servername = $_SERVER['SERVER_ADDR'];
$db_username = "root";
$db_password = "Wyc935398521!";
$database = "fee";
$mysqli = new mysqli($servername, $db_username, $db_password, $database);
$resp = array();
$resp["data"] = getData($mysqli);
echo json_encode($resp);
?>
