import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import config from '../config/config';
import abi from '../contract/ChirpingABI.json';
export const EthereumContext = createContext();

export const useEthereum = () => useContext(EthereumContext);

export const EthereumProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [contract, setContract] = useState(null);
    const [loader, setLoader] = useState(false);
    // console.log("config", config.contractAddress)

    const contractAddress = config.contractAddress;
    // Function to connect wallet and authenticate user
    const authenticate = async () => {
        setLoader(true);
        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const contractWithSigner = contract.connect(signer);

            // Request account access if needed 
            const accounts = await provider.send("eth_requestAccounts", []);

            console.log("currUser = ", await contractWithSigner.showCurrUser(accounts[0]));
            console.log("accounts - ", accounts, accounts.length > 0)
            if (accounts.length > 0) {
                setContract(contractWithSigner);
                setUser(accounts[0]);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                console.error("No account found. Make sure MetaMask is connected.");
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.error("Failed to authenticate:", error);
        } finally {
            setLoader(false);
        }
    };

    // Function to logout the user
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    // Automatically attempt to connect when component mounts

    return (
        <EthereumContext.Provider value={{
            isAuthenticated,
            user,
            authenticate,
            logout,
            contract,
            loader
        }}>
            {children}
        </EthereumContext.Provider>
    );
};