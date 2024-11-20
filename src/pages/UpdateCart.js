// Importing neccessary modules
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// UpdateCart component
const UpdateCart = () => {
  // State variables
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { cart_id } = location.state || {};
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // Function to fetch cart item
  const fetchCartItem = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcart?cart_id=${cart_id}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      // Setting cart items
      const data = await response.json();
      setCartItems(data[0]);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cart_id) fetchCartItem(); // Calling the fetchCartItem function
  }, [cart_id]);

  // Function to update the cart
  const updateCart = async (updateItem) => {
    // Updating cart item
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/updatecart?cart_id=${cart_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ quantity: updateItem }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setAlertMessage("Cart updated successfully");
      setAlertType("success");
      setIsDisabled(true);
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    } catch (error) {
      setAlertMessage("Failed to update cart ", error.message);
      setAlertType("danger");
    }
  };

  // Rendering the component
  return (
    <div className="container">
      {/* Alert component */}
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage(null);
          setAlertType(null);
        }}
      />
      <form
        style={{
          width: "30%",
          border: "1px solid #000",
          padding: "2rem",
          margin: "3rem",
        }}
      >
        <h2>Update Cart</h2>
        <div className="form-group d-flex flex-column">
          <label className="align-self-start form-label">Quantity</label>
          <input
            type="number"
            name="quantity"
            onChange={(e) => {
              if (e.target.value <= cartItems.available)
                setCartItems((prev) => ({ ...prev, quantity: e.target.value }));
            }}
            min={1}
            max={cartItems.available}
            value={cartItems.quantity || ""}
          />
          <button
            className="btn btn-success mt-4"
            type="submit"
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              updateCart(cartItems.quantity);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCart;
