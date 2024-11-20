// Import necessary modules
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import * as Yup from "yup";
import { useFormik } from "formik";
import { BASE_URL } from "../components/config";

// Register component
const Register = () => {
  // State for displaying alert messages
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // Navigate to the dashboard after successful login
  const navigate = useNavigate();

  // Define validation schema
  const schema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain at least one letter, one number, and one special character"
      )
      .required("Password is required"),
  });

  // Handle Register form submission
  const formik = useFormik({
    // Handling the form submission using formik
    initialValues: {
      // Initial values
      username: "",
      email: "",
      password: "",
    },
    validationSchema: schema, // Validation schema
    onSubmit: async (values, { resetForm }) => {
      // Sending POST Request to register USER
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/register`,
          {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Parsing json as a result
        const data = await response.json();
        setAlertMessage(data);
        setAlertType("success");
        // Resetting form and redirecting user
        resetForm();
        setIsDisabled(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        setAlertMessage("Failed to register ", error.message);
        setAlertType("danger");
      }
    },
  });

  // Rendering the Register form
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
      <form className="adduser-form" onSubmit={formik.handleSubmit}>
        <h2>Login Form</h2>
        <div className="form-group d-flex flex-column">
          <label className="align-self-start form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="username"
            autoComplete="off"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-danger">{formik.errors.username}</div>
          ) : null}

          <label className="align-self-start form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="email"
            autoComplete="off"
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
            autoComplete="off"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}

          <button
            className="btn btn-primary mt-4"
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

export default Register;
