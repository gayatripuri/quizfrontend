import React, { useState } from "react";
import styles from "./AuthComponent.module.css";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom";
import BASEURL from "../../constant/baseurl";
const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(!true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        isLogin
          ?  `${BASEURL}/api/auth/login`
          :  `${BASEURL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        // Handle successful login or registration, e.g., store token in localStorage
       // console.log("Success:", data);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        // Handle errors
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={styles.Auth_MainContainer}>
      <div className={styles.Auth_SubContainer}>
        <div className={styles.Auth_Logo}>QUIZZIE</div>
        <div className={styles.btn_Container}>
          <button
            onClick={() => setIsLogin(false)}
            className={`${styles.signup_btn} ${isLogin ? "" : styles.active}`}
          >
            Signup
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`${styles.login_btn} ${isLogin ? styles.active : ""}`}
          >
            Login
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${styles.auth_formcontainer} ${
            isLogin ? styles.login_formcontainer : styles.register_formcontainer
          }`}
        >
          {!isLogin && (
            <div className={styles.formRow}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className={styles.formRow}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formRow}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {!isLogin && (
            <div className={styles.formRow}>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          <br />
          <button type="submit" className={styles.formSubmitButton}>
            {isLogin ? "Log In" : "Sign-Up"}
          </button>
        </form>

        <br />
      </div>
    </div>
  );
};

export default AuthComponent;
