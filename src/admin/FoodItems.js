// import necessary modules
import { Link, useNavigate } from "react-router-dom";
import "./css/UpdateUser.css";
import React, { useState, useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// FoodItem component
const FoodItem = () => {
  // State variables
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState(null);
  const loadingBarRef = useRef(null);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  // Function to handle update
  const handleUpdate = (foodId) => {
    // Pass userId as a parameter
    navigate(`/admin/updatefooditem`, { state: { id: foodId } });
  };

  // Function to fetch data
  const fetchFoodItems = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart(); // Start the loading bar
    }
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readfooditems`
      );

      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      setError("Failed to fetch ", error.message);
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  };

  // UseEffect to fetch data
  useEffect(() => {
    fetchFoodItems(); // Call the fetchFoodItems function
    setIsDeleted(false);
  }, [isDeleted]);

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the API with the food ID as a parameter
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/deletefooditem`,
        {
          method: "DELETE",
          body: JSON.stringify({ food_id: id }), // Send the ID in the request body
        }
      );
      const data = await response.json();
      setAlertMessage("FoodItem deleted successfully");
      setAlertType("success");
      setIsDeleted(true);
    } catch (error) {
      setAlertMessage("Failed to delete ", error);
      setAlertType("danger");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <LoadingBar color="#f11946" ref={loadingBarRef} />
        <h2 className="text-center mb-4">FoodItem Table</h2>
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
          to="/admin/addfooditem"
          className="btn btn-primary text-white text-decoration-none mb-3"
        >
          Add FoodItem
        </Link>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Available</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {(foodItems.length > 0 &&
                foodItems.map((element) => (
                  <tr key={element.food_id}>
                    <td>{element.food_id}</td>
                    <td>
                      {element.name.charAt(0).toUpperCase() +
                        element.name.slice(1).toLowerCase()}
                    </td>
                    <td style={{ textAlign: "justify", padding: "10px" }}>
                      {element.description}
                    </td>
                    <td>${element.price}</td>
                    <td>{element.category_name}</td>
                    <td>
                      {element.available}
                      <input
                        type="hidden"
                        name="image_url"
                        value={element.image_url}
                        id=""
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdate(element.food_id);
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
                          handleDelete(element.food_id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))) || (
                <tr>
                  <td colSpan="8">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FoodItem;
