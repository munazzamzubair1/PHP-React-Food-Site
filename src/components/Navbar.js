// Importing neccessary modules
import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { BASE_URL } from "./config";

// Creating a Navbar component
const Navbar = () => {
  // State to store the search query
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const pathname = location.pathname;
  document.title = title;

  // Updating title
  useEffect(() => {
    switch (pathname) {
      case "/":
      case "/home":
        setTitle("Home Page");
        break;
      case "/items":
        setTitle("Food Items Page");
        break;
      case "/cart":
        setTitle("Cart Page");
        break;
      case "/login":
        setTitle("Login Page");
        break;
      case "/register":
        setTitle("Register Page");
        break;
      default:
        setTitle("PHP React Food App");
        break;
    }
  }, [pathname]);

  // Updating search
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/home") {
      if (search.length > 0) {
        navigate("/?search=" + encodeURIComponent(search));
      } else {
        navigate("/");
      }
    }
  }, [search, location.pathname, navigate]);

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

  // Deleting cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  };

  // Logging out
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
            to="/"
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
                  activeclassname="active"
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeclassname="active"
                  aria-current="page"
                  to="/items"
                >
                  Items
                </NavLink>
              </li>

              {!userData ? ( // Check if the user is logged in
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      activeclassname="active"
                      to="/login"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      activeclassname="active"
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      activeclassname="active"
                      className="nav-link"
                      aria-current="page"
                      to="/cart"
                    >
                      Cart
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      activeclassname="active"
                      to="/logout"
                      onClick={logOut}
                    >
                      Logout
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            <form
              className="d-flex me-3"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search Food"
                aria-label="Search"
                name={search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
        </div>
      </nav>
      <div
        className="text-primary"
        style={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          position: "absolute",
          right: "20px",
          cursor: "pointer",
        }}
      >
        Hello {userData ? userData.username.toUpperCase() : "Guest"}
      </div>
    </div>
  );
};

export default Navbar;
