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

// Function to update data
function updateData($mysqli, $tableName, $data): bool
{
    $stmt = $mysqli->prepare("UPDATE $tableName SET amount = ? WHERE year = ? AND month = ?");
    if (!$stmt) {
        die("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    $stmt->bind_param("iii", $data['amount'], $data['year'], $data['month']);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'GET') {
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
} elseif ($requestMethod === 'POST') {
    $tableName = isset($_GET['type']) ? $_GET['type'] : 'electricity';

    // Validate the table name to prevent SQL injection
    $validTables = ['electricity', 'gas', 'water'];
    if (!in_array($tableName, $validTables)) {
        die('Invalid data type.');
    }
    $data = json_decode(file_get_contents('php://input'), true);

    if (updateData($mysqli, $tableName, $data)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error']);
    }
}
?>
