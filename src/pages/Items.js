// Import neccessary modules
import React, { useState, useEffect, useContext } from "react";
import { UploadFileSrc } from "../context/UploadFileSrc";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../components/config";

// Define the Items component
const Items = () => {
  // State variables
  const [foodItems, setFoodItems] = useState([]);
  const { url, setUrl } = useContext(UploadFileSrc);
  const [categories, setCategories] = useState([]);
  const [categId, setCategId] = useState(1);
  const navigate = useNavigate();

  // Function to fetch food items
  const fetchFoodItems = async () => {
    try {
      // Try to fetch food items
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readfooditem?category=${
          categId ? categId : 0
        }`
      );
      // Check if the response is ok
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setFoodItems(data); // update the foodItems state with the fetched data
    } catch (error) {
      setFoodItems([]); // set foodItems to an empty array if an error occurs
      console.log("Failed to fetch ", error.message);
    }
  };

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      // Try to fetch categories
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcategories`
      );
      const data = await response.json();
      setCategories(data); // update the categories state with the fetched data
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle category change
  const handleCateg = (id) => {
    setCategId(id);
  };

  useEffect(() => {
    fetchCategories(); // fetch categories when the component mounts
  });

  useEffect(() => {
    fetchFoodItems(); // Fetching food items
  }, [categId]);

  // Function to show single item
  const showSingleItem = (id) => {
    navigate("/singleitem", { state: { food_id: id } });
  };

  // Rendering the component
  return (
    <div className="container">
      <h2 className="mb-3 mt-3">Food Items</h2>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="">Category :</label>
          &nbsp;
          <select
            name="category"
            id=""
            onChange={(e) => {
              handleCateg(e.target.value);
            }}
          >
            {categories && // check if categories is not null
              categories.map((elem) => {
                return (
                  <option value={elem.category_id} key={elem.category_id}>
                    {elem.category_name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="row mt-3 row-cols-1 row-cols-md-3 g-4">
        {(foodItems.length > 0 && // check if foodItems is not empty
          /* Dynamically rendering food items */
          foodItems.map((elem) => {
            return (
              <div className="col mb-4" key={elem.food_id}>
                <div className="card shadow-sm rounded-lg border-0">
                  <img
                    src={`${url}/${elem.image_url}`}
                    className="card-img-top rounded-top"
                    alt="Image of food item"
                    title="Image of food item"
                    height="220px"
                  />
                  <div className="card-body p-4">
                    <h5 className="card-title text-center text-primary font-weight-bold">
                      {elem.name}
                    </h5>
                    <p className="card-text text-muted">
                      {elem.description.slice(0, 200)}...
                    </p>
                    <p className="text-center text-danger font-weight-bold">
                      Price: ${elem.price}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between p-3">
                    <button
                      className="btn btn-outline-primary btn-sm w-45"
                      onClick={() => {
                        showSingleItem(elem.food_id);
                      }}
                    >
                      View Item
                    </button>
                    <button
                      className="btn btn-success btn-sm w-45"
                      onClick={() => {
                        showSingleItem(elem.food_id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })) || <h3>No food items found</h3>}
      </div>
    </div>
  );
};

export default Items;
