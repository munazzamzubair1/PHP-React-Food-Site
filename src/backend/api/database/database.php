<?php
session_start();
// Database and CRUD Operation Code
class Database
{
  private string $hostname;
  private string $username;
  private string $password;
  private string $database;
  private bool $conn = false;  // Variable to track connection status
  private ?mysqli $mysqli = null; // Variable for storing mysqli object
  private array $result = []; // Variable for storing results
  private array $error = []; // Variable for storing errors 

  // Constructor to initialize database connection
  public function __construct($hostname, $username, $password, $database)
  {
    $this->hostname = $hostname;
    $this->username = $username;
    $this->password = $password;
    $this->database = $database;
    // Mysqli database connection 
    if (!$this->conn) {
      $this->mysqli = new mysqli($this->hostname, $this->username, $this->password, $this->database);
      $this->conn = true; // Set connection status to true
    }
    // Check for connection errors
    if ($this->mysqli->connect_error) {
      $this->error[] = "Connection failed: " . $this->mysqli->connect_error;
      return; // Return if connection failed
    }
  }

  // Insert records into the specified table
  public function insert($table, $params = array())
  {
    $this->result = []; // Resetting result variable
    $this->error = []; // Resetting error variable

    if ($this->tableExists($table)) {
      $table_columns = array_keys($params); // Get column names
      $table_columns = implode(', ', $table_columns); // Convert column names to string

      // Prepare placeholders for prepared statement
      $placeholders = str_repeat('?,', count($params) - 1) . '?';

      // Prepare the insert query
      $query = "INSERT INTO $table ($table_columns) VALUES ($placeholders)";
      $stmt = $this->mysqli->prepare($query);

      // Generate the types string and bind values
      $types = "";
      $values = [];

      foreach ($params as $key => $value) {
        if ($key === 'password') {
          // Hash password and add it to values
          $values[] = password_hash($value, PASSWORD_DEFAULT);
          $types .= "s";
        } else {
          // Determine type based on value
          if (is_int($value)) {
            $types .= "i"; // integer
          } elseif (is_float($value)) {
            $types .= "d"; // double
          } elseif (is_string($value)) {
            $types .= "s"; // string
          } else {
            $types .= "b"; // blob (binary data)
          }
          $values[] = $value;
        }
      }

      // Bind parameters dynamically
      $stmt->bind_param($types, ...$values);

      // Execute the statement and check for success
      if ($stmt->execute()) {
        $this->result[] = "Data inserted successfully";
        return true;
      } else {
        $this->error[] = "Query execution failed: " . $stmt->error; // Capture error if query failed
        return false;
      }
    } else {
      $this->error[] = "Table doesn't exist";
      return false;
    }
  }


  // Select records from the specified table
  public function select($table, $columns = "*", $join = "", $where = [], $orderBy = "", $limit = "")
  {
    $this->result = [];  // Resetting result variable
    $this->error = [];   // Resetting error variable

    if ($this->tableExists($table)) { // Check if table exists
      $sql = "SELECT $columns FROM `$table`";

      // Add JOIN clause if provided
      if ($join) {
        $sql .= " JOIN $join";
      }

      // Add WHERE clause if provided
      $params = []; // Array to store where clause values for prepared statement
      if (!empty($where)) {
        $conditions = [];
        foreach ($where as $key => $value) {
          $conditions[] = "$key = ?";
          $params[] = $value; // Store the value for binding
        }
        $sql .= " WHERE " . implode(" AND ", $conditions); // Join conditions with AND
      }

      // Add ORDER BY clause if provided
      if ($orderBy) {
        $sql .= " ORDER BY $orderBy"; // Assuming $orderBy is safe
      }

      // Add LIMIT clause if provided
      if ($limit) {
        $sql .= " LIMIT $limit";
      }

      // Prepare the SQL statement
      if ($stmt = $this->mysqli->prepare($sql)) {
        // Bind parameters if there are any
        if (!empty($params)) {
          $stmt->bind_param(str_repeat("s", count($params)), ...$params); // Assuming all parameters are strings
        }

        // Execute the prepared statement
        if ($stmt->execute()) {
          $res = $stmt->get_result(); // Get the result set

          // Check for rows in the result set
          if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) { // Fetching result and storing in result variable
              $this->result[] = $row;
            }
            $stmt->close(); // Close the statement
            return true;
          } else {
            $stmt->close(); // Close the statement
            return false; // No rows found
          }
        } else {
          $this->error[] = "Query execution failed: " . $stmt->error; // Getting error if query failed
          $stmt->close(); // Close the statement
          return false;
        }
      } else {
        $this->error[] = "Query preparation failed: " . $this->mysqli->error; // Getting error if prepare failed
        return false;
      }
    } else {
      $this->error[] = "Table doesn't exist";
      return false;
    }
  }

  // Select records from the specified table
  public function search($table, $columns = "*", $join = "", $where = [], $orderBy = "", $limit = "")
  {
    $this->result = [];  // Resetting result variable
    $this->error = [];   // Resetting error variable

    if ($this->tableExists($table)) { // Check if table exists
      $sql = "SELECT $columns FROM `$table`";

      // Add JOIN clause if provided
      if ($join) {
        $sql .= " JOIN $join";
      }

      // Add WHERE clause if provided
      $params = []; // Array to store where clause values for prepared statement
      if (!empty($where)) {
        $conditions = [];
        foreach ($where as $key => $value) {
          $conditions[] = "$key LIKE ?"; // Use LIKE for partial matching
          $params[] = "%$value%"; // Add wildcards for search
        }
        $sql .= " WHERE " . implode(" AND ", $conditions); // Join conditions with AND
      }

      // Add ORDER BY clause if provided
      if ($orderBy) {
        $sql .= " ORDER BY $orderBy"; // Assuming $orderBy is safe
      }

      // Add LIMIT clause if provided
      if ($limit) {
        $sql .= " LIMIT $limit";
      }

      // Prepare the SQL statement
      if ($stmt = $this->mysqli->prepare($sql)) {
        // Bind parameters if there are any
        if (!empty($params)) {
          $stmt->bind_param(str_repeat("s", count($params)), ...$params); // Assuming all parameters are strings
        }

        // Execute the prepared statement
        if ($stmt->execute()) {
          $res = $stmt->get_result(); // Get the result set

          // Check for rows in the result set
          if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) { // Fetching result and storing in result variable
              $this->result[] = $row;
            }
            $stmt->close(); // Close the statement
            return true;
          } else {
            $stmt->close(); // Close the statement
            return false; // No rows found
          }
        } else {
          $this->error[] = "Query execution failed: " . $stmt->error; // Getting error if query failed
          $stmt->close(); // Close the statement
          return false;
        }
      } else {
        $this->error[] = "Query preparation failed: " . $this->mysqli->error; // Getting error if prepare failed
        return false;
      }
    } else {
      $this->error[] = "Table doesn't exist";
      return false;
    }
  }

  // Update records in the specified table
  public function update($table, $params = array(), $where = array())
  {
    $this->result = [];
    $this->error = [];

    if ($this->tableExists($table)) {
      $setClause = [];
      $whereClause = [];
      $types = ""; // Will hold the types for the bound parameters
      $values = []; // Will hold the values to bind

      // Build the SET clause and prepare types and values for binding
      foreach ($params as $table_keys => $table_values) {
        $setClause[] = "$table_keys = ?";
        if (is_numeric($table_values)) {
          $types .= "i"; // Integer type
          $values[] = $table_values; // Add numeric value to values array
        } elseif (is_string($table_values)) {
          $types .= "s"; // String type
          $escapedValue = $this->mysqli->real_escape_string($table_values);
          $values[] = $escapedValue; // Add string value to values array
        } elseif (is_double($table_values)) {
          $types .= "d"; // Double type
          $values[] = $table_values; // Add double value to values array
        } else {
          $types .= "b"; // Blob type
          $values[] = $table_values; // Add blob value to values array
        }
      }

      // Build the WHERE clause and prepare types and values for binding
      foreach ($where as $where_key => $where_value) {
        $whereClause[] = "$where_key = ?";
        if (is_numeric($where_value)) {
          $types .= "i"; // Integer type
          $values[] = $where_value; // Add numeric value to values array
        } elseif (is_string($where_value)) {
          $types .= "s"; // String type
          $escapedValue = $this->mysqli->real_escape_string($where_value);
          $values[] = $escapedValue; // Add string value to values array
        } elseif (is_double($where_value)) {
          $types .= "d"; // Double type
          $values[] = $where_value; // Add double value to values array
        } else {
          $types .= "b"; // Blob type
          $values[] = $where_value; // Add blob value to values array
        }
      }

      $setString = implode(", ", $setClause);
      $whereString = implode(" AND ", $whereClause);
      $sql = "UPDATE $table SET $setString";

      if (!empty($whereString)) {
        $sql .= " WHERE $whereString"; // Append WHERE clause if provided
      }

      // Prepare the SQL statement
      $stmt = $this->mysqli->prepare($sql);
      if ($stmt) {
        // Dynamically bind the parameters
        $stmt->bind_param($types, ...$values); // Using unpacking operator to pass values

        // Execute the statement
        $res = $stmt->execute();

        if ($res) {
          $this->result[] = "Number of rows updated " . $stmt->affected_rows; // Get the number of affected rows
          return true;
        } else {
          $this->error[] = "Query execution failed: " . $stmt->error; // Capture execution error
          return false;
        }
      } else {
        $this->error[] = "Query preparation failed: " . $this->mysqli->error; // Capture prepare error
        return false;
      }
    } else {
      $this->error[] = "Table doesn't exist"; // Table doesn't exist
      return false;
    }
  }

  // Delete records from the specified table
  public function delete($table, $whereParams = [])
  {
    $this->result = [];
    $this->error = [];

    if ($this->tableExists($table)) { // Check if table exists
      $sql = "DELETE FROM $table";

      // Prepare the WHERE clause
      $whereClause = "";
      $types = ""; // For binding parameters
      $values = []; // To hold the values for binding

      if (!empty($whereParams)) {
        // Build the WHERE clause
        $whereConditions = [];
        foreach ($whereParams as $key => $value) {
          $whereConditions[] = "$key = ?";
          if (is_numeric($value)) {
            $types .= "i"; // Integer type
          } elseif (is_string($value)) {
            $types .= "s"; // String type
          } elseif (is_double($value)) {
            $types .= "d"; // Double type
          } else {
            $types .= "b"; // Blob type
          }
          $values[] = $value; // Add value to binding array
        }
        $whereClause = " WHERE " . implode(" AND ", $whereConditions);
        $sql .= $whereClause; // Append the WHERE clause to the SQL statement
      }

      // Prepare the SQL statement
      $stmt = $this->mysqli->prepare($sql);
      if ($stmt) {
        // Bind parameters if there are any
        if (!empty($whereParams)) {
          $stmt->bind_param($types, ...$values); // Using unpacking operator to bind values
        }

        // Execute the statement
        $res = $stmt->execute();
        if ($res) {
          $this->result[] = "Record deleted successfully";
          return true;
        } else {
          $this->error[] = " Query execution failed : " . $stmt->error; // Capture execution error
          return false;
        }
      } else {
        $this->error[] = " Query preparation failed : " . $this->mysqli->error; // Capture prepare error
        return false;
      }
    } else {
      $this->error[] = "Table doesn't exist";
      return false;
    }
  }

  // Save Upload File Function
  public function saveFile($file, $target_directory)
  {
    $this->result = []; // Reset result
    $this->error = []; // Reset error
    $file_name = $file['name']; // Get file name
    // Getting file extension
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION)); // Get file extension
    $file_size = $file['size']; // Get file size
    $tmp_name = $file['tmp_name']; // Get temporary file name
    $date = date("d-m-Y-H-i-s"); // Get current date and time
    $new_file_name = pathinfo($file_name, PATHINFO_FILENAME) . $date . "." . $file_extension;

    // Check if file size exceeds 10 MB
    if ($file_size > 10485760) {
      // Error if file size exceeds 10 MB
      $this->error[] = "File size shouldn't exceed more than 10 mb";
      return false;
    } else {
      // Check if file extension is allowed
      $extension = ['jpg', 'png', 'jpeg']; // Allowed extensions
      if (in_array($file_extension, $extension)) {
        // Move uploaded file to target directory
        if (move_uploaded_file($tmp_name, $target_directory . "/" . $new_file_name)) {
          $this->result[] = $new_file_name; // Assign filename to result variable
          return true;
        } else {
          $this->error[] = "File couldn't be uploaded"; // Error if file couldn't be uploaded
          return false;
        }
      } else {
        $this->error[] = "File extension not allowed"; // Error if file extension not allowed
        return false;
      }
    }
  }


  // Check if the table exists in the database
  private function tableExists($table)
  {
    $query = "SHOW TABLES LIKE '$table'";
    $res = $this->mysqli->query($query);
    if ($res->num_rows > 0) {
      return true; // Return true if table exists
    } else {
      return false; // Return false if table doesn't exist
    }
  }

  // Login System Function 
  public function login($username, $password)
  {
    // Verifiying password of user with database and preparing mysqli query, binding parameters and then executing it 
    $stmt = $this->mysqli->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($hashpassword);
    $stmt->fetch(); // Fetching password from database
    // Check if both password and hashpassword matched
    if (password_verify($password, $hashpassword)) {
      return true; // Return true if password and hashpassword matched
    }
    return false;
  }


  // Get Result Function 
  public function getResult()
  {
    $tempResult = $this->result;
    $this->result = [];
    return $tempResult; // Returning results variable value
  }

  // Get Error Information
  public function getErrorInfo()
  {
    $tempError = $this->error;
    $this->error = [];
    return $tempError; // Returning error variable value
  }

  // Closing Mysqli connection if opened
  public function __destruct()
  {
    if ($this->conn) { // Checking if connection is opened
      $this->mysqli->close(); // Closing connection
      $this->conn = false; // Setting connection variable to false
    }
  }
}
?>