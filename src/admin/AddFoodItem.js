// import necessary modules
import React, { useState, useEffect } from "react";
import "./css/AddFoodItem.css";
import Alert from "../components/Alert";
import { useFormik } from "formik"; // Import useFormik
import * as Yup from "yup"; // Import Yup
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../components/config";

// Define the AddFoodItem component
const AddFoodItem = () => {
  // set states
  const [categories, setCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [image, setNewImage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false); // Set isDisabled to false
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Set isImageUploaded to false
  const navigate = useNavigate(); // Initialize navigate

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

  // useEffect to fetch categories
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
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      available: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      // Handle form submission

      setIsImageUploaded(true);
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/createfooditem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        if (data) {
          setAlertMessage("food item added successfully");
          setAlertType("success");
          formik.resetForm();
          setNewImage(null);
          setIsDisabled(true); // Disable form inputs
          setTimeout(() => {
            navigate("/admin/fooditems");
          }, 1500);
        }
      } catch (error) {
        setAlertMessage("Failed to add food item: " + error.message);
        setAlertType("danger");
      }
    },
  });

  // Form fields
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
          <h2>Add Food Item</h2>

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
              <option selected>Select Category</option>
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

export default AddFoodItem;
