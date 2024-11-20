// import necessary modules
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Categories.css";
import Alert from "../components/Alert";
import LoadingBar from "react-top-loading-bar";
import { BASE_URL } from "../components/config";

// Categories component
const Categories = () => {
  // State variables
  const [categories, setCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const loadingLocate = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch categories
  const fetchCategories = async () => {
    if (loadingLocate.current) {
      setLoading(true);
      loadingLocate.current?.continuousStart();
    }
    try {
      // Try to fetch categories
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcategories`
      );
      const data = await response.json();
      setCategories(data); // update the categories state with the fetched data
    } catch (error) {
      setAlertMessage("Failed to fetch categories: " + error.message);
      setAlertType("danger");
    } finally {
      if (loadingLocate.current) {
        loadingLocate.current?.complete();
        setLoading(false); // Make sure to stop loading on error as well
      }
    }
  };

  useEffect(() => {
    fetchCategories(); // fetch categories when the component mounts
  }, []);

  // Updating
  const handleUpdate = (cat_id) => {
    navigate("/admin/updatecategory", { state: { category_id: cat_id } });
  };

  // Deleting
  const handleDelete = async (cat_id) => {
    // Function to handle delete
    try {
      // Try to delete category
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/deletecategory`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_id: cat_id }),
        }
      );
      const data = await response.json(); // Parse the response as JSON
      if (data) {
        // If data is not null
        setAlertMessage("Category deleted successfully");
        setAlertType("success");
        fetchCategories();
      }
    } catch (error) {
      // If there is an error
      setAlertMessage("Failed to delete category");
      setAlertType("danger");
    }
  };
  return (
    <div className="container mt-5">
      <LoadingBar color="#f11946" ref={loadingLocate} />
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
        to="/admin/addcategory"
        id="addCategBtn"
        className="btn btn-outline-primary btn-sm"
      >
        Add Category
      </Link>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((element) => {
                return (
                  <tr key={element.category_id}>
                    {" "}
                    {/* Add key prop */}
                    <td>{element.category_id}</td>
                    <td>
                      {element.category_name.charAt(0).toUpperCase() +
                        element.category_name.slice(1).toLowerCase()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          // Pass category_id as a parameter
                          handleUpdate(element.category_id);
                        }}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          // Pass category_id as a parameter
                          handleDelete(element.category_id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
