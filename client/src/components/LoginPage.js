import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken, authToken, setUserEmail } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    // creds to go server
    console.log(credentialResponse);

    const idToken = credentialResponse.credential;
    setToken(idToken);  // save the token, so all calls to the service can be authenticated.
    // Decode the token to get user info
    const user = jwtDecode(idToken); 
    const { name, email } = user;
    setUserEmail(email);

    // Send the access token to the backend for validation
    const response = await fetch('http://localhost:8080/validate-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
      },
    });

    const userData = await response.json();

    console.log('User Data:', userData);
    navigate('/home');  
  }

  return (
    <div>
      <h1>ResFrac Weather</h1>
      <GoogleOAuthProvider clientId="768224754997-jhh8h44n5v8qojvj1g11mnbe4k3f4lbt.apps.googleusercontent.com">
        <div>
          <GoogleLogin onSuccess={handleSuccess} onFailure={error => { console.error(error) }} />
        </div>
    </GoogleOAuthProvider>
    </div>
  );
};

export default LoginPage;