import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    // creds to go server
    console.log(credentialResponse);

    // this doesn't work
    // const { access_token } = credentialResponse;
    // console.log('Access Token:', access_token); // Log the token

    const idToken = credentialResponse.credential; // Get the ID token
    console.log('--- jwt decode')
    const user = jwtDecode(idToken); // Decode the token to get user info

    console.log('------------------------------');
    console.log(user);
    console.log('------------------------------');


    const { name, email } = user; // Extract name and email
    console.log('Login Success:', user);
    console.log('Name:', name);
    console.log('Email:', email);

    // // store the token in the session
    // const { access_token } = credentialResponse;

    // // Send the access token to the backend for validation and user info extraction

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
      <h1>LoginPage</h1>
      <GoogleOAuthProvider clientId="768224754997-jhh8h44n5v8qojvj1g11mnbe4k3f4lbt.apps.googleusercontent.com">
        <div>
          <GoogleLogin onSuccess={handleSuccess} onFailure={error => { console.error(error) }} />
        </div>
    </GoogleOAuthProvider>
    </div>
  );
};

export default LoginPage;