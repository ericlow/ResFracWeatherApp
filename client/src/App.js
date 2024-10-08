import logo from './logo.svg';

import axios from 'axios';
import './App.css';
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


//data will be the string we send from our server
const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

const LoginButton = () => {
  const handleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential; // Get the ID token
    console.log('--- jwt decode')
     const user = jwtDecode(idToken); // Decode the token to get user info

     const { name, email } = user; // Extract name and email

     console.log('Login Success:', user);
     console.log('Name:', name);
     console.log('Email:', email);

    // You can save this information in your app's state or context as needed
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
    // Handle errors here
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      logo="YOUR_LOGO_URL" // Optional: Add your logo URL
    />
  );
};
 


function App() {
  return (
    <div className="App">
      <header className="App-header">

        <button onClick={apiCall}>Make Weather API Call</button>

        <GoogleOAuthProvider clientId="768224754997-jhh8h44n5v8qojvj1g11mnbe4k3f4lbt.apps.googleusercontent.com">
          <div>
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);

                const idToken = credentialResponse.credential; // Get the ID token
                console.log('--- jwt decode')
                 const user = jwtDecode(idToken); // Decode the token to get user info
            
                 const { name, email } = user; // Extract name and email
            
                 console.log('Login Success:', user);
                 console.log('Name:', name);
                 console.log('Email:', email);
            
              }}
              onFailure={error => {
                console.error(error);
              }}
            />
          </div>
        </GoogleOAuthProvider>

      </header>
    </div>
  );
}

export default App;

