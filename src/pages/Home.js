// Import necessary modules
import React, { useState, useEffect, useContext } from "react"; // Import useState from React
import "./Home.css";
import slideImage from "../assets/images/slide-img.png"; // Import the image
import { UploadFileSrc } from "../context/UploadFileSrc";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../components/config";

// Define the Home component
const Home = () => {
  // State variables
  const [foodItems, setFoodItems] = useState([]);
  const { url, setUrl } = useContext(UploadFileSrc);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.search) {
      // Check if search query is present
      setSearch(decodeURIComponent(location.search));
    } else {
      setSearch("");
    }
  }, [location.search]);

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

  // Function to fetch data
  const fetchFoodItems = async () => {
    try {
      // Try to fetch food items
      const url = search
        ? `${BASE_URL}/src/backend/api/routes/index.php/searchfoods${search}`
        : `${BASE_URL}/src/backend/api/routes/index.php/readfooditems`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      setFoodItems([]);
      console.log("Failed to fetch ", error.message);
    }
  };

  useEffect(() => {
    fetchFoodItems(); // Fetching food items
  }, [search]);

  // Function to show single item
  const showSingleItem = (id) => {
    navigate("/singleitem", { state: { food_id: id } });
  };
  return (
    <section className="container">
      <div className="row align-items-center">
        {/* Use align-items-center to center content vertically */}
        <div className="col-md-6 text-start">
          <h1 className="mb-3">Welcome to Our Restaurant</h1>
          <p className="mb-3">
            At Restaurant, we believe that dining is not just about food; it's
            an experience to be cherished. Nestled in the heart of [Location],
            we invite you to indulge in a culinary journey that celebrates
            flavors from around the world. Our passionate chefs use only the
            freshest ingredients to create exquisite dishes that tantalize your
            taste buds.
          </p>
          <button
            className="btn btn-primary mb-3 me-2"
            style={{ backgroundColor: "#fc5d35", border: "none" }}
          >
            Shop Now
          </button>
          {/* Increased size */}
          <button
            className="btn btn-secondary mb-3 me-2"
            style={{ border: "none" }}
          >
            Contact Us
          </button>
        </div>
        <div className="col-md-6">
          <img src={slideImage} alt="Delicious food" className="img-fluid" />
        </div>
      </div>

      <div className="row mt-3 row-cols-1 row-cols-md-3 g-4">
        {(foodItems.length > 0 &&
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
          })) || (
          <div className="row w-100 mt-3">
            <p className="text-center fs-2 text-bold">No food items found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
