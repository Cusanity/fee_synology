<?php
header('Access-Control-Allow-Origin: *');
function getData($mysqli, $tableName): array
{
    $myArray = array();
    $stmt = $mysqli->prepare("SELECT * FROM $tableName");
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_array(MYSQLI_ASSOC)) {
        $myArray[] = $row;
    }
    $stmt->close();
    return $myArray;
}

$servername = "localhost";
$db_username = "root";
$db_password = "Wyc935398521!";
$database = "fee";
$mysqli = new mysqli($servername, $db_username, $db_password, $database);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Use a query parameter to determine which data to fetch
$tableName = isset($_GET['type']) ? $_GET['type'] : 'electricity';

// Validate the table name to prevent SQL injection
$validTables = ['electricity', 'gas', 'water'];
if (!in_array($tableName, $validTables)) {
    die('Invalid data type.');
}

$resp = array();
$resp["data"] = getData($mysqli, $tableName);
echo json_encode($resp);
?>
