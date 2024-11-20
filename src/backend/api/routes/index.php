<?php
include_once "../controllers/DbController.php"; // Including DbController

// Creating API for CRUD Operations
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Authorization, Access-Control-Allow-Headers');

// Creating instance of DbController
$db_controller = new DbController();
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_SERVER['PATH_INFO']) ? pathinfo(trim($_SERVER['PATH_INFO'], "/"), PATHINFO_FILENAME) : '';
$requestData = json_decode(file_get_contents('php://input'), true);
$result = null; // Initialize $result variable
$where = null; // Initialize $where variable


// Handle the request based on the HTTP method
switch ($method) {
  case 'POST':
    switch ($endpoint) {
      case 'createuser':
        $result = $db_controller->createUser($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'createcategory':
        $result = $db_controller->createcategory($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'createfooditem':
        $result = $db_controller->createfooditem($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'register':
        $result = $db_controller->register($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'login':
        $username = $requestData['username'];
        $password = $requestData['password'];
        $result = $db_controller->login($username, $password);
        $requestData = null; // Reset $requestData variable
        break;
      case 'createcart':
        $result = $db_controller->createCart($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'createorder':
        $result = $db_controller->createOrder($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      default:
        $result = ['message' => 'Invalid endpoint']; // Return error message
    }
    break;
  case 'GET':
    switch ($endpoint) {
      case 'readusers':
        $result = $db_controller->readUsers();
        break;
      case 'readuser':
        $id = isset($_GET['user_id']) ? $_GET['user_id'] : null; // Get the 'user_id' parameter from the query string
        $result = $db_controller->readuser(['user_id' => $id]);
        $id = null; // Reset $id variable
        break;
      case 'readcategories':
        $result = $db_controller->readcategories();
        break;
      case 'readcategory':
        $id = isset($_GET['category_id']) ? $_GET['category_id'] : null; // Get the 'category_id' parameter from the query string
        $result = $db_controller->readcategory(['category_id' => $id]);
        $id = null; // Reset $id variable
        break;
      case 'readfooditems':
        $result = $db_controller->readfooditems();
        break;
      case 'readfooditem':
        $category = isset($_GET['category']) ? $_GET['category'] : null; // Get the 'category' parameter from the query string
        $id = isset($_GET['food_id']) ? $_GET['food_id'] : null; // Get the 'food_id' parameter from the query string
        $result = $db_controller->readfooditem($id ? ['food_id' => $id] : ['category' => $category]);
        $id = null; // Reset $id variable
        break;
      case 'logout':
        $result = $db_controller->logOut();
        break;
      case 'readcart':
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null; // Get the 'user_id' parameter from the query string
        $cart_id = isset($_GET['cart_id']) ? $_GET['cart_id'] : null;
        $result = $db_controller->readCart($user_id ? ['cart.user_id' => $user_id] : ['cart_id' => $cart_id]);
        $user_id = null; // Reset $user_id variable
        break;
      case 'searchfoods':
        $search = isset($_GET['search']) ? $_GET['search'] : null; // Get the 'search' parameter from the query string
        $result = $db_controller->searchFoodItems(['name' => $search]);
        $search = null; // Reset $search variable
        break;
      default:
        $result = ['message' => 'Invalid endpoint'];
    }

    break;
  case 'PUT':
    switch ($endpoint) {
      case 'updateuser':
        $id = isset($_GET['user_id']) ? $_GET['user_id'] : null; // Get the 'user_id' parameter from the query string
        $result = $db_controller->updateUser($requestData, ['user_id' => $id]);
        $id = null; // Reset $id variable
        $requestData = null; // Reset $requestData variable
        break;
      case 'updatecategory':
        $where = isset($_GET['category_id']) ? $_GET['category_id'] : null;
        $result = $db_controller->updatecategory($requestData, ['category_id' => $where]);
        $requestData = null; // Reset $requestData variable
        break;
      case 'updatefooditem':
        $where = isset($_GET['food_id']) ? $_GET['food_id'] : null;  // Get the 'where' condition from the custom header
        $result = $db_controller->updatefooditem($requestData, ['food_id' => $where]);
        $requestData = null; // Reset $requestData variable
        break;
      case 'updatecart':
        $where = isset($_GET['cart_id']) ? $_GET['cart_id'] : null;  // Get the 'where' condition from the custom header
        $result = $db_controller->updateCart($requestData, ['cart_id' => $where]);
        $requestData = null; // Reset $requestData variable
        break;
      default:
        $result = ['message' => 'Invalid endpoint'];
    }
    break;
  case 'DELETE':
    switch ($endpoint) {
      case 'deleteuser':
        $result = $db_controller->deleteUser($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'deletecategory':
        $result = $db_controller->deletecategory($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'deletefooditem':
        $result = $db_controller->deletefooditem($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'deletecart':
        $result = $db_controller->deleteCart($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      case 'deleteorder':
        $result = $db_controller->deleteOrder($requestData);
        $requestData = null; // Reset $requestData variable
        break;
      default:
        $result = ['message' => 'Invalid endpoint'];
    }
    break;
  default:
    $result = ['message' => 'Invalid request method'];
}

// Output the result as JSON
echo json_encode($result, JSON_PRETTY_PRINT);
?>