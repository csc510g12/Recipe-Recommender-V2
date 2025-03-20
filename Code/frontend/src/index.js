/* MIT License

Copyright (c) 2025 Ayush Gala, Ayush Pathak, Keyur Gondhalekar */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = createRoot(document.getElementById('root'));

/*
* Commented the function because JWT auth was replaced by OAuth systems in previous version
*/

// const RegisterUser = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   console.log(user);

//   const registerUser = async () => {
//     await axios.post('http://localhost:1000/api/v1/recipes/auth/oAuthLogin', {
//       userName: user.name,
//       email: user.email,
//     });
//   };
//   registerUser();
//   window.location.href = window.location.origin;
//   return null;
// };

root.render(
  <ChakraProvider>
    <React.StrictMode>
      <Auth0Provider
        domain="dev-5vygcaduceyyn4d4.us.auth0.com"
        clientId="IkGqT2Q6THFKoX1b3RN8cOnPH1aNKevw"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
        //onRedirectCallback={RegisterUser}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();