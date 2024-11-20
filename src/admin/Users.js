// import necessary modules
import { Link, useNavigate } from "react-router-dom";
import "./css/UpdateUser.css";
import React, { useState, useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import Alert from "../components/Alert";

// Users component
const Users = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const loadingBarRef = useRef(null);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  // Function to handle update
  const handleUpdate = (userId) => {
    // Pass userId as a parameter
    navigate(`/admin/updateuser`, { state: { id: userId } });
  };

  // Function to fetch data
  const fetchUsers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart(); // Start the loading bar
    }
    // Try to fetch data
    try {
      const response = await fetch(
        "http://localhost/php/php-react-food-app/src/backend/api/routes/index.php/readusers"
      );

      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setUsers(data); // Set the fetched data
    } catch (error) {
      setError("Failed to fetch"); // Set the error message
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete(); // Complete the loading bar
      }
    }
  };

  // UseEffect to fetch data
  useEffect(() => {
    fetchUsers(); // Fetch data
  }, []);

  // Function to handle delete
  const handleDelete = async (id) => {
    // Try to delete
    try {
      const response = await fetch(
        "http://localhost/php/php-react-food-app/src/backend/api/routes/index.php/deleteuser",
        {
          method: "DELETE",
          body: JSON.stringify({ user_id: id }), // Send the ID in the request body
        }
      );
      const data = await response.json();
      setAlertMessage("User deleted successfully");
      setAlertType("success");
      setTimeout(() => {
        fetchUsers(); // Refresh the data after deletion
      }, 1500);
    } catch (error) {
      setAlertMessage("Failed to delete ", error.message);
      setAlertType("danger");
      console.log(error);
    }
  };

  // Render the component
  return (
    <>
      <div className="container mt-5">
        <LoadingBar color="#f11946" ref={loadingBarRef} />
        <h2 className="text-center mb-4">Users Table</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Alert
          message={alertMessage}
          type={alertType}
          duration={1000}
          onClose={() => {
            setAlertMessage(null);
            setAlertType(null);
          }}
        />
        <Link
          to="/admin/adduser"
          className="btn btn-primary text-white text-decoration-none mb-3"
        >
          Add User
        </Link>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                // Map over the fetched data
                users.map((element) => (
                  <tr key={element.user_id}>
                    <td>{element.user_id}</td>
                    <td>
                      {element.username.charAt(0).toUpperCase() +
                        element.username.slice(1).toLowerCase()}
                    </td>
                    <td>{element.email}</td>
                    <td>{element.role}</td>
                    <td>{element.created_at}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdate(element.user_id);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          handleDelete(element.user_id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
