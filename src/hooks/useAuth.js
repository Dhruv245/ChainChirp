import { useState, useCallback } from 'react';

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import axios from "axios";

function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState({});


  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const ServerUrl = "http://localhost:4000";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAuth = async () => {

    console.log("handle auth is called");
    if (isConnected) {
      await disconnectAsync();
    }
    // enabling the web3 provider metamask
    const res = await connectAsync({
      connector: injected({ target: 'metaMask'}),
    });

    const { accounts, chainId } = res;

    const userData = { address: accounts[0], chain: chainId };

    const { data } = await axios.post(
      `${ServerUrl}/request-message`,
      userData,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const message = data.message;

    const signature = await signMessageAsync({ message });

    await axios.post(
      `${ServerUrl}/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    let authdataToreturn = null;

    axios(`${ServerUrl}/authenticate`, {
        withCredentials: true,
      })
        .then(({ data }) => {
          const { iat, ...authData } = data; // remove unimportant iat value
          console.log("authenticating")
          setSession(authData);
          console.log("authenticating with ", authData)
          setUser(authData);
          setIsAuthenticated(true);
          authdataToreturn = authData;
        })
        .catch((err) => {
          console.log("error authenticating")
          console.log(err);
          authdataToreturn = null;
        });

        return authdataToreturn
  };


  async function signOut() {
    await axios(`${ServerUrl}/logout`, {
      withCredentials: true,
    });

  }

  // Function to log in and set user state
  const authenticate = /**useCallback(*/async () => {
    try {
      await handleAuth();
      // console.log("setting user data as ", session)
      // console.log("user data is ", user)
      // console.log("isAuthenticated is ", isAuthenticated)
      // setIsAuthenticated(true);
      // console.log("isAuthenticated is ", isAuthenticated)s
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
    }
  }/** , [handleAuth, isAuthenticated, session, user]);*/

  // Function to log out and clear user state
  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { authenticate, logout, isAuthenticated, user };
}

export default useAuth;
