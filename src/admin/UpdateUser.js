// Import necessary modules
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/UpdateUser.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Alert from "../components/Alert";
import { BASE_URL } from "../components/config";

// UpdateUser component
const UpdateUser = () => {
  // Declaring necessary variables
  const location = useLocation();
  const [singleRecord, setSingleRecord] = useState([{}]);
  const { id } = location.state;
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "" });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  // Fetching the single user data
  const fetchSingleUser = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/src/backend/api/routes/index.php/readuser?user_id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching user data");
      }
      const data = await response.json();
      setSingleRecord(data);
      setNewUser({
        username: data[0].username,
        email: data[0].email,
        role: data[0].role,
      });
    } catch (error) {
      console.log("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, [id]);

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string()
      .oneOf(["customer", "admin"], "Role is required")
      .required("Role is required"),
  });

  const formik = useFormik({
    enableReinitialize: true, // This allows formik to update initialValues
    initialValues: newUser, // Use newUser directly here
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(
          `${BASE_URL}/src/backend/api/routes/index.php/updateuser?user_id=` +
            id,
          {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data) setIsDisabled(true);
        setAlertMessage("User data updated successfully!");
        setAlertType("success");
        resetForm();
        setTimeout(() => {
          navigate("/admin/users");
        }, 1500);
      } catch (error) {
        setAlertMessage("Failed to update " + error);
        setAlertType("danger");
      }
    },
  });

  return (
    <>
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage(null);
          setAlertType(null);
        }}
      />
      {singleRecord && (
        <form className="update-user" onSubmit={formik.handleSubmit}>
          <h2>Update User</h2>
          <div className="form-group d-flex flex-column">
            <label className="align-self-start form-label">Username</label>
            <input
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
              value={formik.values.username}
              name="username"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-danger">{formik.errors.username}</div>
            ) : null}
            <label className="align-self-start form-label mt-2">Email</label>
            <input
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="email"
              className="form-control"
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
            <label className="align-self-start form-label mt-2">Role</label>
            <select
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
              value={formik.values.role}
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
              className="btn btn-primary mt-3"
              disabled={isDisabled}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateUser;
