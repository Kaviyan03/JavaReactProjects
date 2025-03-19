import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../../context/UserContext";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users");
        if (user?.role === "admin") {
          setUsers(response.data.filter((user) => user?.role !== "admin"));
        } else {
          setSelectedUser(user);
          fetchTasks(user?.id);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  const fetchTasks = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/tasks?assignedTo=${userId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleGetHistory = (userId) => {
    setSelectedUser(users.find((user) => user?.id === userId));
    fetchTasks(userId);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const existingUser = users.find((u) => u.email === values.email);
        if (existingUser) {
          alert("Error: This email is already registered.");
          return;
        }

        await axios.post("http://localhost:4000/users", values);
        const updatedUsers = await axios.get("http://localhost:4000/users");
        setUsers(updatedUsers.data.filter((user) => user?.role !== "admin"));
        setShowForm(false);
        resetForm();

        alert("User has been successfully created!");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
  });

  return (
    <div>
      <style>
        {`
          .error-message {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }
          .input-error {
            border: 1px solid red;
          }
        `}
      </style>

      <h2>User Profiles</h2>

      {user?.role === "admin" && (
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add New User"}
          </button>
          {showForm && (
            <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
              <label>Name:</label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                className={formik.touched.name && formik.errors.name ? "input-error" : ""}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error-message">{formik.errors.name}</div>
              )}
              <br />

              <label>Email:</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={formik.touched.email && formik.errors.email ? "input-error" : ""}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
              <br />

              <label>Password:</label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className={formik.touched.password && formik.errors.password ? "input-error" : ""}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error-message">{formik.errors.password}</div>
              )}
              <br />

              <label>Role:</label>
              <select {...formik.getFieldProps("role")}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <br /> <br />

              <button type="submit">Create User</button>
            </form>
          )}

          <ul style={{ marginLeft: "20px" }}>
            {users.map((user) => (
              <li key={user?.id}>
                <strong>Name:</strong> {user?.name} <br />
                <strong>Email:</strong> {user?.email} <br />
                <button onClick={() => handleGetHistory(user?.id)}>
                  Get History
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user?.role !== "admin" && (
        <div>
          <h3>Tasks Worked By {user?.name}</h3>
          <ul style={{ marginTop: "10px", marginLeft: "20px" }}>
            {tasks.map((task) => (
              <li key={task.id}>
                <strong>Title:</strong> {task.title} <br />
                <strong>Description:</strong> {task.description} <br />
                <strong>Status:</strong> {task.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && user?.role === "admin" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Tasks Worked By {selectedUser.name}</h3>
          <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
            {tasks.map((task) => (
              <li key={task.id}>
                <strong>Title:</strong> {task.title} <br />
                <strong>Description:</strong> {task.description} <br />
                <strong>Status:</strong> {task.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
