import React, { useState, useEffect, useContext } from "react";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import AllChirpings from "./AllChirpings";
import ChirpingText from "../assets/images/ChirpingText.png";
import ChirpingLogo from "../assets/logos/ChirpingLogo.png";
import Close from "../assets/images/Close.png";
import ReactModal from "react-modal";
import MyProfile from "./MyProfile";
import { Link } from "react-router-dom";
import CreatorProfile from "./CreatorProfile";
import axios from "axios";
import config from '../config/config';
import abi from '../contract/ChirpingABI.json';
import { ethers } from 'ethers';

// import {  EthereumContext } from "../context/EthereumContext";



const Homepage = () => {
  // const {isAuthenticated, user, authenticate, logout, contract } = useContext(EthereumContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    desp: "",
    imageFile: undefined,
  });
  const [addPictureData, setAddPictureData] = useState({
    imageFile: undefined,
  });
  const [navStatus, setNavStatus] = useState({
    home: true,
    myChirpings: false,
    myCagedChirpings: false,
    myProfile: false,
    creatorProfile: false,
  });

  const [promoteLevelModal, setPromoteLevelModal] = useState(false);
  const [chirpingModal, setChirpingModal] = useState(false);
  const [addNameData, setAddNameData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [promoteLevelStatus, setpromoteLevelStatus] = useState(false);
  const [allChirpings, setAllChirpings] = useState([]);
  const [myChirpings, setMyChirpings] = useState([]);
  const [myCagedChirpings, setMyCagedChirpings] = useState([]);
  const [instructionModal, setInstructionModal] = useState(false);
  const [currUser, setCurrUser] = useState();
  const [userData, setUserData] = useState({
    username: "",
    totalChirpings: 0,
    totalWings: 0,
    totalCages: 0,
    level: 0,
  });
  const [currCreator, setCurrCreator] = useState();


  useEffect(() => {
    const getData = async () => {
      const currentUser = await contract.showCurrUser(user);

      const CurrUser = {
        uId: Number(currentUser[0]),
        username: currentUser[1].toString(),
        totalChirpings: Number(currentUser[2]),
        totalWings: Number(currentUser[3]),
        totalChirpTokens: Number(currentUser[4]),
        level: Number(currentUser[5]),
        totalCages: Number(currentUser[6]),
        prevTimestamp: Number(currentUser[7]),
        name: currentUser[8].toString(),
        displayPicture: currentUser[9].toString(),
      }


      setCurrUser(CurrUser);

      /**
       * struct User {
        uint uId;
        address username;
        uint256 totalChirpings;
        uint256 totalWings;
        uint256 totalChirpTokens;
        uint256 level;
        uint256 totalCages;
        uint256 prevTimestamp;
        string name;
        string displayPicture;
    }
      */


      setUserData({
        ...userData,
        username: CurrUser.username,
        totalChirpings: CurrUser.totalChirpings,
        totalWings: CurrUser.totalWings,
        totalCages: CurrUser.totalCages,
        level: CurrUser.level,
      });


      const AllChirpings = await contract.getAllChirpings();
      setAllChirpings(AllChirpings);


      const MyChirps = await contract.getMyChirpings(user);
      setMyChirpings(MyChirps);

      const MyCagedChirps = await contract.getCagedChirpings(user);
      setMyCagedChirpings(MyCagedChirps);

    };

    if (isAuthenticated) {
      getData();
    }
  }, [user, isAuthenticated, contract]);

  const getCreatorData = async (_creator) => {
    const x = await contract.showCurrUser(_creator);
    return x;
  };

  const givingWings = async (chirpingId) => {
    try {
      const transaction = await contract.givingWings(chirpingId);
      setLoading(true);
      await transaction.wait();
      setLoading(false);
      // window.location.reload();
    } catch (err) {
      alert(err.data.message);
    }
  };

  const wingsGiven = async (chirpingId) => {
    const result = await contract.wingsGivenCheck(chirpingId, currUser.username);
    return result;
  };

  const givingCage = async (uId) => {
    setLoading(true);
    const transaction = await contract.givingCage(uId);
    await transaction.wait();
    setLoading(false);
    window.location.reload();
  };

  const cagesGiven = async (chirpingId) => {
    const result = await contract.cagesGivenCheck(chirpingId, currUser.username);
    return result;
  };

  const promoteLevel = async (username) => {
    setLoading(true);
    const transaction = await contract.promoteLevel(username);
    await transaction.wait();
    setpromoteLevelStatus(true);
    setLoading(false);
    console.log("Level status has been updated");
  };

  const promoteLevelCheck = () => {
    if (
      currUser.totalChirpings >= 10 &&
      currUser.totalChirpings < 20 &&
      currUser.totalWings >= 20 &&
      currUser.level === 0
    ) {
      return true;
    } else if (
      currUser.totalChirpings >= 20 &&
      currUser.totalChirpings < 30 &&
      currUser.totalWings >= 40 &&
      currUser.level < 2
    ) {
      return true;
    } else if (
      currUser.totalChirpings >= 30 &&
      currUser.totalChirpings < 50 &&
      currUser.totalWings >= 60 &&
      currUser.level < 3
    ) {
      return true;
    } else if (
      currUser.totalChirpings >= 50 &&
      currUser.totalChirpings < 70 &&
      currUser.totalWings >= 80 &&
      currUser.level < 4
    ) {
      return true;
    } else if (
      currUser.totalChirpings >= 70 &&
      currUser.totalChirpings < 100 &&
      currUser.totalWings >= 100 &&
      currUser.level < 5
    ) {
      return true;
    } else {
      return false;
    }
  };

  const addingName = async () => {
    setLoading(true);
    const transaction = await contract.addName(addNameData.name);
    await transaction.wait();
    setLoading(false);
    window.location.reload();
  };

  const addUser = async (username) => {
    try {
      const transaction = await contract.addUser(username, "");
      setLoading(true);
      await transaction.wait();
      setLoading(false);
      window.location.reload();
      console.log("User has been added");
      setInstructionModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("user", user, isAuthenticated);
    const add = async () => {
      await addUser(user);
      setLoggedIn(true);
    }

    if (isAuthenticated) {
      if (!loggedIn) {
        add();
      }
    }
  }, [user, isAuthenticated])

  const login = async () => {
    try {
      setLoading(true);

      try {

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(config.contractAddress, abi, signer);

        const contractWithSigner = contract.connect(await signer);

        // Request account access if needed 
        const accounts = await provider.send("eth_requestAccounts", []);

        if (accounts.length > 0) {
          setContract(contractWithSigner);
          setUser(accounts[0]);
          console.log("Account:", user, accounts[0]);
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
      }

      console.log("Logged in as ", user);
      await addUser(currUser.username);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  const logOut = async () => {
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
    console.log("logged out");
  };

  // const uploadImage = async () => {
  //   const data = formData.imageFile[0];
  //   const file = new Moralis.File(data.name, data);
  //   await file.saveIPFS();
  //   return file.ipfs();
  // };
  const uploadImage = async () => {
    const data = formData.imageFile[0];
    const Data = new FormData();
    Data.append('file', data); // Append the file from the input

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: Data,
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY || 'b6ad9e90fdd515b0565e',
          pinata_secret_api_key: process.env.PINATA_API_SECRET || '7af98d693be43df62b4473dc1f85c2ec5ccf53292ab16af8037af0ae6f21d73b',
          'Content-Type': 'multipart/form-data',
        },
      });
      const ipfsHash = response.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error('Failed to upload image to Pinata:', error);
      throw new Error('Failed to upload image');
    }
  };


  const uploadDisplayPicture = async () => {
    const data = addPictureData.imageFile[0];
    const formData = new FormData();
    formData.append('file', data); // Append the file from the input

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY || 'b6ad9e90fdd515b0565e',
          pinata_secret_api_key: process.env.PINATA_API_SECRET || '7af98d693be43df62b4473dc1f85c2ec5ccf53292ab16af8037af0ae6f21d73b',
          'Content-Type': 'multipart/form-data',
        },
      });
      const ipfsHash = response.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error('Failed to upload display picture to Pinata:', error);
      throw new Error('Failed to upload display picture');
    }
  };


  const settingImageURL = async () => {
    let imageUrl = "";
    if (currUser.level >= 5) {
      if (formData.imageFile === undefined) {
        return imageUrl;
      } else {
        const imageURL = await uploadImage();
        return imageURL;
      }
    } else {
      return imageUrl;
    }
  };

  const settingDisplayPictureURL = async () => {
    if (currUser.level >= 5) {
      const imageURL = await uploadDisplayPicture();
      return imageURL;
    }
  };

  const pinJSONToIPFS = async (jsonObject) => {
    const data = JSON.stringify(jsonObject);
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNDgwOGYzMi1hMGUyLTQ1ZDMtYjg3Mi02YjgzYjMzNzNmMTEiLCJlbWFpbCI6InNpZGRoYXJ0aHByYW5heTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI2YWQ5ZTkwZmRkNTE1YjA1NjVlIiwic2NvcGVkS2V5U2VjcmV0IjoiN2FmOThkNjkzYmU0M2RmNjJiNDQ3M2RjMWY4NWMyZWM1Y2NmNTMyOTJhYjE2YWY4MDM3YWYwYWU2ZjIxZDczYiIsImV4cCI6MTc1NjMwNTM1M30.D-p1hxz38GLQi0toFkzuW6kcWItlGxBHZ90nP3IuVOY'}` // Ensure your API token is securely handled
        },
        body: data
      });
      const resData = await response.json();
      if (response.ok) {
        return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
      } else {
        throw new Error('Failed to pin data to IPFS: ' + resData.error);
      }
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw error; // Rethrowing error to be handled by the caller
    }
  };

  const addChirping = async () => {
    setLoading(true);

    try {
      // Assuming settingImageURL is another function that returns a direct URL to an image
      const imageUrl = await settingImageURL();
      const metadata = {
        chirpingText: formData.desp,
        imageURL: imageUrl,
      };

      // Upload JSON metadata to IPFS using Pinata
      const jsonUrl = await pinJSONToIPFS(metadata);

      // Assuming you have a contract ready to handle the transaction
      const strLen = formData.desp.length;
      const transaction = await contract.addChirping(strLen, jsonUrl, jsonUrl);
      await transaction.wait();

      // console.log("Metadata IPFS URL: ", jsonUrl);
      // console.log("Transaction executed");

      // Resetting UI and reloading might not be necessary or best practice, consider updating UI based on state
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding chirping:", error);
      setLoading(false);
    }
  };

  const addPicture = async () => {
    setLoading(true);
    const imageURL = await settingDisplayPictureURL();

    const transaction = await contract.changeDisplayPicture(imageURL);
    await transaction.wait();
    setLoading(false);
    window.location.reload();
  };


  // if (loader) {
  //   return <div>Loading...</div>;  // Show a loading indicator while authentication is in progress
  // }

  return (
    <div className="mainBg">

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 2rem 0rem 2rem",
        }}
      >
        <ReactModal
          className="loading"
          style={{
            overlay: {
              backgroundColor: "rgb(228, 179, 229, 0.45)",
              backdropFilter: "blur(5px)",
            },
          }}
          isOpen={loading}
        >
          <img
            alt="Logo Animation"
            src={ChirpingLogo}
            style={{
              width: "12rem",
              position: "absolute",
              top: "35%",
              right: "45%",
            }}
          ></img>
        </ReactModal>
        <ReactModal
          className="addPictureModal"
          style={{
            width: "20rem",
            height: "15rem",
            overlay: {
              backgroundColor: "rgb(228, 179, 229, 0.45)",
            },
          }}
          isOpen={promoteLevelModal}
          onRequestClose={() => {
            setPromoteLevelModal(false);
          }}
        >
          <div
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
            onClick={() => {
              setPromoteLevelModal(false);
            }}
          >
            <img
              alt="Close"
              src={Close}
              style={{ width: "1.5rem", marginRight: "1rem" }}
            ></img>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {promoteLevelStatus ? (
              <span className="text" style={{ fontSize: "32px" }}>
                You've Been Promoted
              </span>
            ) : (
              <span className="text" style={{ fontSize: "32px" }}>
                Processing, please wait!
              </span>
            )}
          </div>
        </ReactModal>
        <ReactModal
          className="chirpingModal"
          style={{
            overlay: {
              backgroundColor: "rgb(228, 179, 229, 0.45)",
            },
          }}
          isOpen={chirpingModal}
          onRequestClose={() => {
            setChirpingModal(false);
          }}
        >
          <div
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
            onClick={() => {
              setChirpingModal(false);
            }}
          >
            <img
              alt="Close"
              src={Close}
              style={{ width: "2rem", marginRight: "1rem" }}
            ></img>
          </div>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={() => {
              setChirpingModal(false);
              addChirping();
            }}
          >
            <textarea
              className="textfield"
              style={{ width: "30rem", height: "8rem", marginTop: "2rem" }}
              type="text"
              value={formData.desp}
              placeholder="Chirp here!!"
              onChange={(e) => {
                setFormData({ ...formData, desp: e.target.value });
              }}
            ></textarea>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                width: "35rem",
              }}
            >
              {currUser ? (
                currUser.level >= 5 ? (
                  <input
                    className="textField"
                    type="file"
                    style={{ marginTop: "2rem", marginLeft: "4rem" }}
                    onChange={(e) => {
                      e.preventDefault();
                      setFormData({ ...formData, imageFile: e.target.files });
                    }}
                  ></input>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>

            <input
              className="textfield"
              type="submit"
              style={{
                width: "10rem",
                height: "3rem",
                fontSize: "20px",
                marginTop: "2rem",
              }}
            ></input>
          </form>
        </ReactModal>
        <ReactModal
          className="chirpingModal"
          style={{
            overlay: {
              backgroundColor: "rgb(228, 179, 229, 0.45)",
            },
          }}
          isOpen={instructionModal}
          onRequestClose={() => {
            setInstructionModal(false);
          }}
        >
          <div
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
            onClick={() => {
              setInstructionModal(false);
            }}
          >
            <img
              alt="Close"
              src={Close}
              style={{ width: "2rem", marginRight: "1rem" }}
            ></img>
          </div>
          <div className="text" style={{ fontSize: "30px" }}>
            Instructions
          </div>
        </ReactModal>
        {!user ? (
          <button className="connectWallet" onClick={login}>
            <span style={{ fontSize: "22px" }}>Connect Wallet</span>
          </button>
        ) : (
          <div>
            <button className="connectWallet2" onClick={logOut}>
              <span style={{ fontSize: "14px" }}>Logout</span>
            </button>
            <div
              className="displayPicture"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                alt="Profile"
                src={currUser ? currUser.displayPicture : ""}
                style={{
                  width: "8rem",
                  height: "8rem",
                }}
              ></img>
            </div>
          </div>
        )}
        <div
          style={{
            height: "15vh",
            width: "60%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Link to="/">
            <img
              alt="Chirping logo"
              src={ChirpingLogo}
              className="chirpingLogo"
            ></img>
          </Link>

          <img
            alt="Chirping text"
            src={ChirpingText}
            style={{
              marginTop: "10px",
              width: "35rem",
              position: "absolute",
              // top: "-3%",
              left: "30%",
              right: "25%",
            }}
          ></img>
        </div>
        <div
          style={{
            height: "75vh",
            width: "100%",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="leftSideBar">
            <LeftSideBar
              currUser={currUser}
              setChirpingModal={setChirpingModal}
              setNavStatus={setNavStatus}
              navStatus={navStatus}
            />
          </div>
          <div className="middleBar">
            {user ? (
              <div>
                {navStatus.home ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {allChirpings
                      .map((chirping) => (
                        <AllChirpings
                          key={chirping.chirpingId}
                          chirping={chirping}
                          givingCage={() => {
                            givingCage(chirping.chirpingId);
                          }}
                          givingWings={async () => {
                            await givingWings(chirping.chirpingId);
                          }}
                          wingsGivenCheck={async () => {
                            const x = await wingsGiven(chirping.chirpingId);
                            return x;
                          }}
                          cagesGivenCheck={async () => {
                            const x = await cagesGiven(chirping.chirpingId);
                            return x;
                          }}
                          getCreatorData={async () => {
                            const x = await getCreatorData(chirping.creator);
                            return x;
                          }}
                          setNavStatus={setNavStatus}
                          setCurrCreator={setCurrCreator}
                        />
                      ))
                      .reverse()}
                  </div>
                ) : navStatus.myChirpings ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {myChirpings
                      .map((chirping) => (
                        <AllChirpings
                          key={chirping.chirpingId}
                          chirping={chirping}
                          givingCage={() => {
                            givingCage(chirping.chirpingId);
                          }}
                          givingWings={() => {
                            givingWings(chirping.chirpingId);
                          }}
                          wingsGivenCheck={async () => {
                            const x = await wingsGiven(chirping.chirpingId);
                            return x;
                          }}
                          cagesGivenCheck={async () => {
                            const x = await cagesGiven(chirping.chirpingId);
                            return x;
                          }}
                          getCreatorData={async () => {
                            const x = await getCreatorData(chirping.creator);
                            return x;
                          }}
                          setNavStatus={setNavStatus}
                          setCurrCreator={setCurrCreator}
                        />
                      ))
                      .reverse()}
                  </div>
                ) : navStatus.myCagedChirpings ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {myCagedChirpings
                      .map((chirping) => (
                        <AllChirpings
                          key={chirping.chirpingId}
                          chirping={chirping}
                          givingCage={() => {
                            givingCage(chirping.chirpingId);
                          }}
                          givingWings={() => {
                            givingWings(chirping.chirpingId);
                          }}
                          wingsGivenCheck={async () => {
                            const x = await wingsGiven(chirping.chirpingId);
                            return x;
                          }}
                          cagesGivenCheck={async () => {
                            const x = await cagesGiven(chirping.chirpingId);
                            return x;
                          }}
                          getCreatorData={async () => {
                            const x = await getCreatorData(chirping.creator);
                            return x;
                          }}
                          setCurrCreator={setCurrCreator}
                        />
                      ))
                      .reverse()}
                  </div>
                ) : navStatus.myProfile ? (
                  <MyProfile
                    currUser={currUser}
                    addPicture={addPicture}
                    setAddPictureData={setAddPictureData}
                    addPictureData={addPictureData}
                    addNameData={addNameData}
                    setAddNameData={setAddNameData}
                    addingName={addingName}
                  />
                ) : navStatus.creatorProfile ? (
                  <CreatorProfile
                    currCreator={async () => {
                      const x = await getCreatorData(currCreator);
                      return x;
                    }}
                  />
                ) : (
                  <div>Something Else</div>
                )}
              </div>
            ) : (
              <div
                className="text"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40vh",
                  fontSize: "50px",
                }}
              >
                Please Connect Your Wallet
              </div>
            )}
          </div>
          <div style={{ height: "100%", width: "25%" }}>
            {/* {console.log(currUser, "curr user from right")} */}
            <RightSideBar
              currUser={currUser}
              setPromoteLevelModal={setPromoteLevelModal}
              promoteLevel={promoteLevel}
              promoteLevelCheck={() => {
                const x = promoteLevelCheck();
                return x;
              }}
            />
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <button onClick={login}>Connect Wallet</button>
    //   <button onClick={logOut}>Logout</button>
    // </div>
  );
};

export default Homepage;