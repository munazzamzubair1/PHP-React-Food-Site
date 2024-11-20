// Importing neccessary modules
import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { BASE_URL } from "./config";

// Creating a AdminNavbar component
const AdminNavbar = () => {
  // State variables
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const pathname = location.pathname;
  document.title = title;

  // Updating title
  useEffect(() => {
    switch (pathname) {
      case "/admin/users":
        setTitle("Users Page");
        break;
      case "/admin/adduser":
        setTitle("Add User Page");
        break;
      case "/admin/updateuser":
        setTitle("Update User Page");
        break;
      case "/admin/fooditems":
        setTitle("Food Items Page");
        break;
      case "/admin/addfooditem":
        setTitle("Add Food Item Page");
        break;
      case "/admin/updatefooditem":
        setTitle("Update Food Item Page");
        break;
      case "/admin/categories":
        setTitle("Categories Page");
        break;
      case "/admin/addcategory":
        setTitle("Add Category Page");
        break;
      case "/admin/updatecategory":
        setTitle("Update Category Page");
        break;
      default:
        setTitle("PHP React Food App");
        break;
    }
  }, [pathname]);

  // Getting cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return JSON.parse(parts.pop().split(";").shift());
    }
    return null;
  };

  // Retrieve the cookie
  const userData = getCookie("username");

  // Check if the user is logged in
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    } else if (userData.role != "admin") {
      navigate("/");
    }
  }, [userData, navigate]);

  // Deleting cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  };

  // Function to handle logout
  const logOut = async () => {
    // Make a GET request to the logout API endpoint
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/logout`
      );
      if (!response.ok) {
        throw new Error("Failed to log out");
      }
      const data = await response.json();
      if (data.status === true) {
        deleteCookie("username");
        navigate("/");
      }
    } catch (error) {
      console.log("Failed to logout ", error.message);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link
            className="navbar-brand ms-5"
            to="/admin"
            style={{ color: "#4d4d4c" }}
          >
            <i
              className="fas fa-utensils me-2 fs-4"
              style={{ color: "#fc5d35" }}
            ></i>
            Restoran
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto me-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/admin/users"
                  activeclassname="active"
                >
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to="/admin/fooditems"
                >
                  FoodItems
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to="/admin/categories"
                >
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to=""
                  onClick={logOut}
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;
