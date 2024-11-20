// import necessary modules
import React, { useState, useEffect, useContext } from "react";
import { UploadFileSrc } from "../context/UploadFileSrc";
import "./css/AddFoodItem.css";
import Alert from "../components/Alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../components/config";

// UpdateFoodItem component
const UpdateFoodItem = () => {
  // set states
  const [categories, setCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [image, setNewImage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [foodItem, setFoodItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: "",
    image_url: "",
  });
  const { url, setUrl } = useContext(UploadFileSrc);
  const navigate = useNavigate();
  const location = useLocation();
  const food_id = location.state.id;

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
        category: data[0].category,
        available: data[0].available,
        image_url: data[0].image_url,
      });
      setAlertMessage("Food Item fetched successfully");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Failed to fetch food item " + error.message);
      setAlertType("danger");
      console.log("Failed to fetch food item " + error.message);
    }
  };

  // useEffect to fetch food item
  useEffect(() => {
    fetchFoodItem(); // Fetch food item
  }, [food_id]);

  // function to fetch categories
  const fetchCategories = async () => {
    try {
      // Try to fetch categories
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcategories`
      );
      // Parse the response as JSON
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setAlertMessage("Failed to fetch categories", error);
      setAlertType("danger"); // Set alert type to 'danger'
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  // Define validation schema
  const schema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.number().required("Category is required"),
    available: Yup.number().required("Available is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: foodItem,

    validationSchema: schema,
    onSubmit: async (values) => {
      // Submit form data
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/updatefooditem?food_id=` +
            food_id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        if (data) {
          setAlertMessage("FoodItem updated successfully");
          setAlertType("success");
          formik.resetForm();
          setNewImage(null);
          setIsDisabled(true); // Disable form inputs
          setTimeout(() => {
            navigate("/admin/fooditems");
          }, 1500);
        }
      } catch (error) {
        setAlertMessage("Failed to update food item: " + error.message);
        setAlertType("danger");
      }
    },
  });

  // function to handle image upload
  const handleChange = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/upload.php/uploadimg`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setNewImage(data[0]);
      formik.setFieldValue("image_url", data[0]);
    } catch (error) {
      setAlertMessage("Failed to upload image: " + error.message);
      setAlertType("danger");
    }
  };

  // render the component
  return (
    <div>
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

        <form className="addFoodItem" onSubmit={formik.handleSubmit}>
          <h2>Update Food Item</h2>

          <div className="form-group d-flex flex-column">
            <label className="align-self-start form-label">Name</label>
            <input
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
              name="name"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}

            <label className="align-self-start form-label mt-2">
              Description
            </label>
            <textarea
              name="description"
              id=""
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-danger">{formik.errors.description}</div>
            ) : null}

            <label className="align-self-start form-label mt-2">Price</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="text-danger">{formik.errors.price}</div>
            ) : null}

            <label className="align-self-start form-label mt-2">
              Categories
            </label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control mb-3"
            >
              <option disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            {formik.touched.category && formik.errors.category ? (
              <div className="text-danger">{formik.errors.category}</div>
            ) : null}

            <label className="align-self-start form-label mt-2">Image</label>
            <input
              type="file"
              name="image_url"
              className="form-control"
              onChange={handleChange}
            />
            <img
              src={`${url}/${formik.values.image_url}`}
              style={{ height: "130px", width: "200px" }}
              alt="Image of Food"
              className="img img-fluid mb-3 mt-2"
            />
            <label className="align-self-start form-label mt-2">
              Available
            </label>
            <input
              type="number"
              name="available"
              value={formik.values.available}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            />
            {formik.touched.available && formik.errors.available ? (
              <div className="text-danger">{formik.errors.available}</div>
            ) : null}

            <button
              className="btn btn-primary mt-3"
              disabled={isDisabled}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFoodItem;
