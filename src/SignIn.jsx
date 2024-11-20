import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function SignIn() {
  const navigate = useNavigate();

  const handleGoogleLoginError = () => {
    console.log('Google login failed.');
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);

    try {
      // Attempt user registration
      
      await axios.post(`${import.meta.env.VITE_APIURL}/users/register`, {
        email: decoded.email,
        password: decoded.name,
        image:decoded.picture
      });

      // After successful registration, sign in the user
      const signInResponse = await axios.post(`${import.meta.env.VITE_APIURL}/users/SignIn`, {
        email: decoded.email,
        password: decoded.name,
      });

      if (signInResponse.data.message === "user logged in successfully") {
        localStorage.setItem("accessToken", signInResponse.data.data.accessToken);
        localStorage.setItem("refreshToken", signInResponse.data.data.refreshToken);
        navigate("/home");
      }
    } catch (error) {
      // If registration fails due to existing user, attempt sign-in directly
      if (error.response?.data.message === "Username or Email already exist") {
        const signInResponse = await axios.post(`${import.meta.env.VITE_APIURL}/users/SignIn`, {
          email: decoded.email,
          password: decoded.name,
          
        });

        if (signInResponse.data.message === "user logged in successfully") {
          localStorage.setItem("accessToken", signInResponse.data.data.accessToken);
          localStorage.setItem("refreshToken", signInResponse.data.data.refreshToken);
          navigate("/home");
        } else {
          console.log("Sign-in failed.");
        }
      } else {
        console.error("Error during login process:", error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Token not found in localStorage');
          navigate('/');
          return;
        }

        // Fetch user data from the backend
        const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/redirect`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        

        // If the user exists, set the user data
        if (response.data.data === 'user exist') {
          
          navigate('/home'); // Redirect to the home page
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);

        // Handle the case where the user does not exist
        if (error.response && error.response.data.data === 'user does not exist') {
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <div className="GoogleSignIn">
    
      <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
    </div>
  );
}

export default SignIn;
