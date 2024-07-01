<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$db_username = "root";
$db_password = "Wyc935398521!";
$database = "fee";
$mysqli = new mysqli($servername, $db_username, $db_password, $database);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Function to get data
function getData($mysqli, $tableName): array
{
    $myArray = array();
    $stmt = $mysqli->prepare("SELECT * FROM $tableName");
    if (!$stmt) {
        die("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_array(MYSQLI_ASSOC)) {
        $myArray[] = $row;
    }
    $stmt->close();

    // Find the latest month and year
    if (count($myArray) > 0) {
        $latest = end($myArray);
        $latestYear = $latest['year'];
        $latestMonth = $latest['month'];

        // Add a new row for the next month
        $nextMonth = $latestMonth + 1;
        $nextYear = $latestYear;

        if ($nextMonth > 12) {
            $nextMonth = 1;
            $nextYear += 1;
        }

        $myArray[] = [
            'year' => $nextYear,
            'month' => $nextMonth,
            'amount' => '',
            'isNew' => true,  // Mark this row as new for insertion
        ];
    } else {
        // If no data, start with the current month
        $currentYear = date('Y');
        $currentMonth = date('n');

        $myArray[] = [
            'year' => $currentYear,
            'month' => $currentMonth,
            'amount' => '',
            'isNew' => true,  // Mark this row as new for insertion
        ];
    }

    return $myArray;
}

// Function to update data
function updateData($mysqli, $tableName, $data): bool
{
    $stmt = $mysqli->prepare("UPDATE $tableName SET amount = ? WHERE year = ? AND month = ?");
    if (!$stmt) {
        die("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    $stmt->bind_param("dii", $data['amount'], $data['year'], $data['month']);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

// Function to insert data
function insertData($mysqli, $tableName, $data): bool
{
    $stmt = $mysqli->prepare("INSERT INTO $tableName (year, month, amount) VALUES (?, ?, ?)");
    if (!$stmt) {
        die("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    $stmt->bind_param("iid", $data['year'], $data['month'], $data['amount']);
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

    if (isset($data['isNew']) && $data['isNew']) {
        if (insertData($mysqli, $tableName, $data)) {
            echo json_encode(['status' => 'success', 'action' => 'insert']);
        } else {
            echo json_encode(['status' => 'error', 'action' => 'insert']);
        }
    } else {
        if (updateData($mysqli, $tableName, $data)) {
            echo json_encode(['status' => 'success', 'action' => 'update']);
        } else {
            echo json_encode(['status' => 'error', 'action' => 'update']);
        }
    }
}
?>
