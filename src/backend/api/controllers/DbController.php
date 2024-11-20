<?php

include_once "../database/database.php";

class DbController // Class to handle database operations
{
  private $db;
  public function __construct()
  { // Constructor to establish a database connection
    $this->db = new Database('localhost', 'root', '', 'food-site');
  }

  // CRUD Operation for User
  public function createUser($data)
  { // Insert a new user into the database
    $res = $this->db->insert("users", $data);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to insert ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Fetch all users from the database
  public function readUsers()
  {
    $res = $this->db->select("users", "user_id, username, email, role, created_at");
    return ($res) ? $this->db->getResult() : ['message' => 'No user found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Fetch a specific user from the database
  public function readUser($where)
  {
    $res = $this->db->select("users", "user_id, username, email, role, created_at", "", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'No user found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Update a user's data in the database
  public function updateUser($data, $where)
  {
    $res = $this->db->update("users", $data, $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to update ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Delete a user from the database
  public function deleteUser($where)
  {
    $res = $this->db->delete("users", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to delete ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // CRUD Operation for categories

  // Function for creating a category
  public function createCategory($data)
  {
    $res = $this->db->insert("categories", $data);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to insert ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Fetch all categories from the database
  function readCategories()
  {
    $res = $this->db->select("categories", "*");
    return ($res) ? $this->db->getResult() : ['message' => 'No category found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Fetch a specific category from the database
  public function readCategory($where)
  {
    $res = $this->db->select("categories", "*", "", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'No category found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Update a category's data in the database
  public function updateCategory($data, $where)
  {
    $res = $this->db->update("categories", $data, $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to update ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Delete a category from the database
  public function deleteCategory($where)
  {
    $res = $this->db->delete("categories", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to delete ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // CRUD Operation for FoodItems

  // Insert a new food item into the database
  public function createFoodItem($data)
  {
    $res = $this->db->insert("food_items", $data);
    if ($res) {
      return $this->db->getResult();
    } else {
      return ['message' => 'Failed to insert: ' . $this->db->getErrorInfo(), 'status' => false];
    }
  }

  // Fetch all food items from the database
  public function readFoodItems()
  {
    $res = $this->db->select("food_items", "food_id, name, description, price, category_name, category, image_url, available, created_at", " categories ON food_items.category = categories.category_id");
    return ($res) ? $this->db->getResult() : ['message' => 'No food item found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Fetch a specific food item from the database
  public function readFoodItem($where)
  {
    $res = $this->db->select("food_items", "food_id, name, description, price, category_name, category, image_url, available, created_at", " categories ON food_items.category = categories.category_id", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'No food item found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Update a food item's data in the database
  public function updateFoodItem($data, $where)
  {
    $res = $this->db->update("food_items", $data, $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to update ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Delete a food item from the database
  public function deleteFoodItem($where)
  {
    $res = $this->db->delete("food_items", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to delete ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for login
  public function login($username, $password)
  {
    // Attempt to log in with provided credentials
    $res = $this->db->login($username, $password);

    // Check if login was successful
    if ($res) {
      // Fetch user credentials if login is successful
      $credentials = $this->db->select("users", "user_id, username, role", "", ["username" => $username]);
      $user = $credentials ? $this->db->getResult() : ['message' => 'Failed to fetch user data', 'status' => false];

      // Check if user exists and fetch role
      if (($user)) {
        // Set session variables
        $_SESSION['user_id'] = $user[0]['user_id'];
        $_SESSION['username'] = $user[0]['username'];
        $_SESSION['role'] = $user[0]['role'];

        // Return success response with user role
        return [
          'message' => 'Login successful',
          'id' => $user[0]['user_id'],
          'username' => $user[0]['username'],
          'role' => $user[0]['role'],
          'status' => true
        ];
      }
    }


    // If login fails, return failure response
    return [
      'message' => 'Username and password do not match',
      'status' => false
    ];
  }

  // Function for registering customer
  public function register($data)
  {
    $data['role'] = 'customer';
    $res = $this->db->insert("users", $data);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to register ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for logging out the user
  public function logout()
  {
    // Unset session variables
    unset($_SESSION['user_id']);
    unset($_SESSION['username']);
    unset($_SESSION['role']);

    // Unset all of the session variables in one go
    session_unset();
    // Destroy the session
    session_destroy();

    // Return a success message
    return ['message' => 'Logged out successfully', 'status' => true];
  }


  // Function for creating a cart
  public function createCart($data)
  {
    $res = $this->db->insert("cart", $data);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to insert ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for reading a cart
  public function readCart($where)
  {
    $res = $this->db->select("cart", "cart.cart_id, cart.user_id, cart.food_id, cart.quantity, users.username, food_items.name, food_items.available, food_items.price", " users ON cart.user_id = users.user_id JOIN food_items ON cart.food_id = food_items.food_id", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'No cart found ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for updating a cart
  public function updateCart($data, $where)
  {
    $res = $this->db->update("cart", $data, $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to update ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for deleting a cart
  public function deleteCart($where)
  {
    $res = $this->db->delete("cart", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to delete ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for creating an order
  public function createOrder($data)
  {
    $res = $this->db->insert("orders", $data);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to insert ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for deleting a cart
  public function deleteOrder($where)
  {
    $res = $this->db->delete("orders", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to delete ' . $this->db->getErrorInfo(), 'status' => false];
  }

  // Function for searching food items
  public function searchFoodItems($where)
  {
    $res = $this->db->search("food_items", "food_id, name, description, price, category_name, category, image_url, available, created_at", "  categories ON food_items.category = categories.category_id", $where);
    return ($res) ? $this->db->getResult() : ['message' => 'Failed to fetch ' . $this->db->getErrorInfo(), 'status' => false];
  }
}

?>