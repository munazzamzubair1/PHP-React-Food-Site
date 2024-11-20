// Importing necessary modules
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UploadFileSrc } from "../context/UploadFileSrc";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// SingleItem component
const SingleItem = () => {
  // State variables
  const location = useLocation(); // Using the useLocation hook
  const { url, setUrl } = useContext(UploadFileSrc); // Using the context
  const food_id = location.state.food_id; // Extracting food id
  const [foodItem, setFoodItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: "",
    image_url: "",
  });

  // State for displaying alert messages
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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

  // Fetching foodItem using food id
  const fetchFoodItem = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readfooditem?food_id=` +
          food_id
      );
      const data = await response.json();
      setFoodItem({
        name: data[0].name,
        description: data[0].description,
        price: data[0].price,
        category: data[0].category_name,
        available: data[0].available,
        image_url: data[0].image_url,
      });
      document.title = data[0].name;
    } catch (error) {
      console.log("Failed to fetch food item " + error.message);
    }
  };

  useEffect(() => {
    fetchFoodItem(); // Calling the fetchFoodItem function
  }, [food_id]);

  // Increment and decrement cart
  const incrementCart = () => {
    setQuantity(quantity + 1);
  };
  const decrementCart = () => {
    setQuantity(quantity - 1);
  };

  // Adding to cart
  const addToCart = async (foodQuantity, foodId) => {
    if (!userData) {
      navigate("/login");
      return;
    }

    // Make a POST request to add the food item to the cart
    const userId = userData.user_id;
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/createcart`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            food_id: foodId,
            quantity: foodQuantity,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data) {
        setAlertMessage("Added to cart successfully");
        setAlertType("success");
        setIsDisabled(true);
        setTimeout(() => {
          navigate("/cart", { state: { uid: userId } });
        }, 1500);
      }
    } catch (error) {
      setAlertMessage("Failed to add to cart " + error.message);
      setAlertType("danger");
    }
  };

  return (
    <div className="container mt-4">
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1500}
        onClose={() => {
          setAlertType(null);
          setAlertMessage(null);
        }}
      />
      <div className="row">
        <div className="col-md-4">
          {/* Image */}
          <img
            src={`${url}/${foodItem.image_url}`}
            className="img-fluid rounded"
            alt={foodItem.name}
          />
        </div>
        <div className="col-md-8">
          {/* Item Details */}
          <h3>{foodItem.name}</h3>
          <p>
            <strong>Category:</strong> {foodItem.category}
          </p>
          <p>
            <strong>Description:</strong> {foodItem.description}
          </p>
          <p>
            <strong>Price:</strong> ${foodItem.price}
          </p>
          <p>
            <strong>Availability:</strong>{" "}
            {foodItem.available ? foodItem.available : "Out of Stock"}
          </p>

          {/* Quantity and Add to Cart */}
          {foodItem.available && (
            <div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-secondary"
                  disabled={quantity <= 1}
                  onClick={decrementCart}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control mx-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  max={foodItem.available}
                  min={1}
                />
                <button
                  className="btn btn-secondary"
                  disabled={quantity >= foodItem.available}
                  onClick={incrementCart}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  addToCart(quantity, food_id);
                }}
                disabled={isDisabled}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
