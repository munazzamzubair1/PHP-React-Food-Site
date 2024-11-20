// import necessary modules
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// Define the UpdateCategory component
const UpdateCategory = () => {
  // Define state variables
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [fetchedCategory, setFetchedCategory] = useState({ category_name: "" });
  const [isDisabled, setIsDisabled] = useState(false);

  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // Get the navigate function
  const catId = location.state.category_id; // Get the category ID from the location state

  // Define the fetchCategory function
  const fetchCategory = async () => {
    try {
      // Try to fetch the category
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readcategory?category_id=` +
          catId
      );
      const data = await response.json();
      setFetchedCategory({ category_name: data[0].category_name });
    } catch (error) {
      console.log(error);
    }
  };

  // Define the useEffect hook
  useEffect(() => {
    fetchCategory(); // Fetch the category
  }, [catId]);

  // Define the validation schema
  const schema = Yup.object({
    category_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
      .required("Category is required"),
  });

  // Define the formik object to handle form submission
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category_name: fetchedCategory.category_name,
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/updatecategory?category_id=` +
            catId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        if (data) setIsDisabled(true);
        setAlertMessage("Category updated successfully");
        setAlertType("success");
        setTimeout(() => {
          navigate("/admin/categories"); // navigate to category page after successful submission
        }, 1500);
      } catch (error) {
        setAlertMessage("Failed to update category ", error.message);
        setAlertType("danger");
      }
    },
  });
  return (
    <div>
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
              <h3 className="text-center mb-4">Update Category</h3>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category_name}
                  />
                  {formik.touched.category_name &&
                  formik.errors.category_name ? (
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
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
