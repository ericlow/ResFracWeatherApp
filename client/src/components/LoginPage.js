import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>LoginPage</h1>
      <GoogleOAuthProvider clientId="768224754997-jhh8h44n5v8qojvj1g11mnbe4k3f4lbt.apps.googleusercontent.com">
      <div>
        <GoogleLogin onSuccess={credentialResponse => {
            
            // creds to go server
            console.log(credentialResponse);

            const idToken = credentialResponse.credential; // Get the ID token
            console.log('--- jwt decode')
            const user = jwtDecode(idToken); // Decode the token to get user info

            const { name, email } = user; // Extract name and email
            console.log('Login Success:', user);
            console.log('Name:', name);
            console.log('Email:', email);

            // store the token in the session


            // navigate the user
            navigate('/home');            
          }}
          onFailure={error => {
            console.error(error);
          }}
        />
      </div>
    </GoogleOAuthProvider>
    </div>
  );
};

export default LoginPage;