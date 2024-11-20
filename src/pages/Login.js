// Import necessary modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// Context for storing user role
const Login = () => {
  // Navigate to the dashboard after successful login
  const navigate = useNavigate();

  // State for storing login credentials
  const [logincredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  // State for displaying alert messages
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e) => {
    // Update the login credentials state with the input values
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Setting cookie
  const setCookie = (name, username, role, user_id, days) => {
    const date = new Date();
    // Set the cookie expiration date
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();

    // Convert the object to a JSON string
    const value = JSON.stringify({ username, role, user_id });

    // Set the cookie
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logincredentials),
        }
      );
      const data = await response.json();

      // Check if login was successful
      if (data.status === true) {
        setIsDisabled(true);
        setAlertMessage(data.message);
        setAlertType("success");
        setCookie("username", data.username, data.role, data.id, 2);
        setTimeout(() => {
          // Use data.role directly instead of the state variable
          if (data.role === "admin") {
            navigate("/admin/fooditems");
          } else if (data.role === "customer") {
            navigate("/");
          }
        }, 1500);
      } else {
        // Display error message
        setAlertMessage(data.message);
        setAlertType("danger");
      }
    } catch (error) {
      setAlertMessage("Failed to login, an unexpected error occurred");
      setAlertType("danger");
    }
  };

  return (
    <div className="container">
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage(null);
          setAlertType(null);
        }}
      />
      <form className="adduser-form" onSubmit={handleSubmit}>
        <h2>Login Form</h2>
        <div className="form-group d-flex flex-column">
          <label className="align-self-start form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={logincredentials.username}
            onChange={(e) => handleChange(e)}
            name="username"
            autoComplete="off"
            required
          />
          <label className="align-self-start form-label mt-2">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={logincredentials.password}
            onChange={(e) => handleChange(e)}
            autoComplete="off"
            required
          />
          <button
            className="btn btn-primary mt-4"
            disabled={isDisabled}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
