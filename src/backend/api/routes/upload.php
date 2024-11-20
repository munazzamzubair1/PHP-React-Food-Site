<?php
include_once "../database/database.php"; // Including DbController

// Creating API for CRUD Operations
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Authorization, WHERE, Access-Control-Allow-Headers');

// Creating instance of DbController
$db = new Database("localhost", "root", "", "food-site");
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_SERVER['PATH_INFO']) ? pathinfo(trim($_SERVER['PATH_INFO'], "/"), PATHINFO_FILENAME) : '';
$file = isset($_FILES['file']) ? $_FILES['file'] : null;
$result = null; // Initialize $result variable

// Handle the request based on the HTTP method
switch ($method) {
  case 'POST':
    switch ($endpoint) {
      case 'uploadimg':
        $db->saveFile($file, "upload");
        $result = $db->getResult();
        $file = null; // Reset $file variable
        break;
      default:
        $result = ['message' => 'Invalid endpoint']; // Return error message
    }
    break;
  default:
    $result = ['message' => 'Invalid request method'];
}

// Output the result as JSON
echo json_encode($result, JSON_PRETTY_PRINT);
?>