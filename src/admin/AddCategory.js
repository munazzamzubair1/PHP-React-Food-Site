// import necessary modules
import React, { useState } from "react";
import "./css/AddCategory.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../components/config";

// Define the AddCategory component
const AddCategory = () => {
  // Define state variables
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Define formik and Yup objects
  const schema = Yup.object({
    category_name: Yup.string().required("Category name is required"),
  });
  const formik = useFormik({
    initialValues: {
      category_name: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/createcategory`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        setAlertMessage("Category added successfully");
        if (data) setIsDisabled(true);
        setAlertType("success");
        resetForm(); // reset form after successful submission
        setTimeout(() => {
          navigate("/admin/categories"); // navigate to category page after successful submission
        }, 1500);
      } catch (error) {
        setAlertMessage("Failed to insert category ", error.message);
        setAlertType("danger");
      }
    },
  });

  // Render the component
  return (
    <div className="container mt-5">
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage(null);
          setAlertType(null);
        }}
      />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Add New Category</h3>
            <form
              action=""
              className="add-category-form"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  name="category_name"
                  id="categoryName"
                  placeholder="Enter category name"
                  value={formik.values.category_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {/* Error message */}
                {formik.touched.category_name && formik.errors.category_name ? (
                  <div className="text-danger">
                    {formik.errors.category_name}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={isDisabled}
                className="btn btn-primary custom-submit-btn w-100"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
