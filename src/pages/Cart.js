// Importing neccessary modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// Cart component
const Cart = () => {
  // State variables
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

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

  // Checking if the user is logged in
  if (!userData) {
    navigate("/login");
  }

  // Function to fetch cart items
  const uid = userData.user_id;
  const fetchCartItems = async () => {
    // Fetching cart items
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcart?user_id=${uid}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      // Setting cart items
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartItems(); // Calling the fetchCartItems function
  }, [uid]);

  // Function to update the order
  const updateOrder = (id) => {
    navigate("/updatecart", { state: { cart_id: id } }); // Navigating to the UpdateCart page
  };

  // Function to delete the cart
  const deleteCart = async (cid) => {
    // Fetching cart items
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/deletecart`,
        {
          method: "DELETE",
          body: JSON.stringify({ cart_id: cid }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      // Setting cart items
      const data = await response.json();
      setAlertMessage("Cart deleted successfully");
      setAlertType("success");
      fetchCartItems();
    } catch (error) {
      setAlertMessage("Failed to delete cart");
      setAlertType("danger");
    }
  };

  // Function to update available
  const updateAvailable = async (remain, food_id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/updatefooditem?food_id=` +
          food_id,
        {
          method: "PUT",
          body: JSON.stringify({ available: remain }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to create an order
  const createOrder = async (item) => {
    item.remain = item.available - item.quantity;
    item.totalPrice = item.quantity * item.price;
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/createorder`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: item.user_id,
            food_id: item.food_id,
            total_price: item.totalPrice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      // Setting cart items
      const data = await response.json();
      setAlertMessage("Order created successfully");
      setAlertType("success");
      updateAvailable(item.remain, item.food_id);
      setTimeout(() => {
        deleteCart(item.cart_id);
        fetchCartItems();
      }, 1500);
    } catch (error) {
      setAlertMessage("Failed to create order");
      setAlertType("danger");
    }
  };

  // Rendering the component
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
      <div className="row">
        <h2>Cart</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Food</th>
                <th>Quantity</th>
                <th>Original Price</th>
                <th>Total Price</th>
                <th>Order</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                // Mapping cart items
                cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <tr key={item.cart_id}>
                      <td>{item.cart_id}</td>
                      <td>{item.username}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity * item.price}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => {
                            createOrder(item);
                          }}
                        >
                          Order
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            updateOrder(item.cart_id);
                          }}
                          className="btn btn-success btn-sm"
                        >
                          Update
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            deleteCart(item.cart_id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No items in cart</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cart;
