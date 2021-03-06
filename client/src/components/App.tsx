import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

import { User } from '../services/constants';

const App:FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // when the app loads, check if the user is logged in with google
  useEffect(() => {
    // loads the gapi. we use (window as any) b/c gapi does not exist on window until our script
    // in public/index.html creates it
    (window as any).gapi.load('auth2', () => {
      // initializes the GoogleAuth object, which has all the fun methods we need
      (window as any).gapi.auth2.init({
        client_id:
            '619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com',
      })
        .then(() => {
          // accesses GoogleAuth object and checks if someone is signed in. returns boolean
          if ((window as any).gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // if someone is signed, get that user object
            const userObj = (window as any).gapi.auth2
              .getAuthInstance()
              .currentUser.get();
            // send the token to our server, which will verify it and give us the user from database
            return axios.post('/user/verify', {
              userObj,
              id_token: userObj.wc.id_token,
            });
          }
        })
        .then((response: any): void => {
          if (response) {
            setUser(response.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  }, []);

  return (
    <div>
      <div>
        <Navbar
          user={user}
          setUser={setUser}
        />
      </div>
    </div>
  );
};

export default App;
