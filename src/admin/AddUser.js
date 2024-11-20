// Import necessary modules
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Alert from "../components/Alert";
import "./css/AddUser.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../components/config";

// Define AddUser component
const AddUser = () => {
  // Define state variables
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  // Define validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain at least one letter, one number, and one special character"
      )
      .required("Password is required"),

    role: Yup.string()
      .oneOf(["admin", "customer"], "Role is required")
      .required("Role is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/createuser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setIsDisabled(true);
          setAlertMessage("User added successfully!");
          setAlertType("success");
          resetForm(); // Clear the form after successful submission
          setTimeout(() => {
            navigate("/admin/users"); // Redirect to the users page after successful submission
          }, 1500);
        } else {
          setAlertMessage("An error occurred");
          setAlertType("danger");
        }
      } catch (error) {
        setAlertMessage("Failed to insert user");
        setAlertType("danger");
      }
    },
  });

  return (
    <div className="container">
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => setAlertMessage("")}
      />
      <form className="adduser-form" onSubmit={formik.handleSubmit}>
        <h2>Add User</h2>
        <div className="form-group d-flex flex-column">
          <label className="align-self-start form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-danger">{formik.errors.username}</div>
          ) : null}

          <label className="align-self-start form-label mt-2">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger">{formik.errors.email}</div>
          ) : null}

          <label className="align-self-start form-label mt-2">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}

          <label className="align-self-start form-label mt-2">Role</label>
          <select
            name="role"
            className="form-control mb-3"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          {formik.touched.role && formik.errors.role ? (
            <div className="text-danger">{formik.errors.role}</div>
          ) : null}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isDisabled}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
