// import necessary modules
import "./App.css";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home"; //  Import the Home component
import Users from "./admin/Users"; // Import the Users component
import FoodItems from "./admin/FoodItems"; // Import the FoodItems component
import Categories from "./admin/Categories"; // Import the Categories component
import AddUser from "./admin/AddUser"; // Import the AddUser component
import UpdateUser from "./admin/UpdateUser"; // Import the UpdateUser component
import AddCategory from "./admin/AddCategory"; // Import the AddCategory component
import UpdateCategory from "./admin/UpdateCategory"; // Import the UpdateCategory component
import AddFoodItem from "./admin/AddFoodItem";
import UpdateFoodItem from "./admin/UpdateFoodItem";
import { ContextProvider } from "./context/UploadFileSrc"; // Import the UploadFileSrc context
import Login from "./pages/Login";
import Register from "./pages/Register";
import SingleItem from "./pages/SingleItem";
import Items from "./pages/Items";
import Cart from "./pages/Cart";
import UpdateCart from "./pages/UpdateCart";
import NoPage from "./pages/NoPage";

// Define the App component
function App() {
  return (
    <ContextProvider>
      <div className="App">
        <Router>
          <Content />
        </Router>
      </div>
    </ContextProvider>
  );
}

function Content() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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
  return (
    <>
      {/* // Check if the current route is an admin route */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/singleitem" element={<SingleItem />} />
        {!userData ? ( // Check if the user is logged in
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/cart" element={<Cart />} />
            <Route path="/updatecart" element={<UpdateCart />} />
            <Route path="/logout" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/adduser" element={<AddUser />} />
        <Route path="/admin/updateuser" element={<UpdateUser />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/addcategory" element={<AddCategory />} />
        <Route path="/admin/updatecategory" element={<UpdateCategory />} />
        <Route path="/admin/FoodItems" element={<FoodItems />} />
        <Route path="/admin/addfooditem" element={<AddFoodItem />} />
        <Route path="/admin/updatefooditem" element={<UpdateFoodItem />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;
