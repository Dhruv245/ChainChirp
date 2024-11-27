import React, { useState, useEffect } from "react";
import { getEllipsisTxt } from "../helpers/formatters";
import Cage from "../assets/logos/Cage.png";
import Wings from "../assets/logos/Wings.png";
import Moment from "react-moment";
import WingsYellow from "../assets/logos/WingsYellow.png";
import Level from "../assets/logos/Level.png";
import RedCage from "../assets/logos/RedCage.png";
const { BigNumber } = require("ethers");

const AllChirpings = ({
  chirping,
  givingCage,
  givingWings,
  wingsGivenCheck,
  cagesGivenCheck,
  getCreatorData,
  setNavStatus,
  setCurrCreator,
}) => {
  const [chirpingText, setChirpingText] = useState();
  const [chirpingImage, setChirpingImage] = useState();
  const [chirpingIdArray, setChirpingIdArray] = useState([]);
  const [chirpingIdArray2, setChirpingIdArray2] = useState([]);
  const [wingsGivenTrue, setWingsGivenTrue] = useState(false);
  const [cagesGivenTrue, setCagesGivenTrue] = useState(false);
  const [creatorData, setCreatorData] = useState();
 
  useEffect(() => {
    const showChirpingText = async (_chirpingText) => {
      try {
        let response = await fetch(_chirpingText);
        let responseJson = await response.json();
        const chirpingText = responseJson.chirpingText;
        const chirpingImage = responseJson.imageURL;
        setChirpingText(chirpingText);
        setChirpingImage(chirpingImage);
      } catch (error) {
        console.log(error);
      }
    };

    const setWingsGiven = async () => {
      const x = await wingsGivenCheck();
      setWingsGivenTrue(x);
    };

    const setCagesGiven = async () => {
      const x = await cagesGivenCheck();
      setCagesGivenTrue(x);
    };

    const settingCreatorData = async () => {
      const x = await getCreatorData();
      setCreatorData(x);
    };

    showChirpingText(chirping[2]);
    setWingsGiven();
    setCagesGiven();
    settingCreatorData();
  }, []);

  const onClickName = () => {
    setNavStatus({
      home: false,
      myChirpings: false,
      myCagedChirpings: false,
      myProfile: false,
      creatorProfile: true,
    });
    setCurrCreator(chirping[1]);
  };

  const onClickWings = async () => {
    await givingWings();
    setChirpingIdArray((arr) => [...arr, chirping[0]]);
  };

  const onClickCage = async () => {
    await givingCage();
    setChirpingIdArray2((arr) => [...arr, chirping[0]]);
  };

  // const testing = "checking";
  // console.log("bignumber == >>", typeof testing);
  // const conv = testing.toNumber();
  // console.log("bignumberrrrr == >>", conv);
  // const value = BigNumber.from(chirping[3]);
  // console.log("bignumber == >>",value.toNumber());

  return (
    <>
      <div
        className="chirpingPost"
        style={{
          background: chirping[6] ? "#EC9393" : "rgb(241, 235, 99, 50%)",
        }}
      >
        {chirping[6] ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "50%",
              transform: "translate(50%, -50%)",
              zIndex: "99",
            }}
          >
            <img alt="Red Cage" src={RedCage} style={{ width: "6rem" }}></img>
          </div>
        ) : (
          <div></div>
        )}
        <div
          style={{
            opacity: chirping[6] ? "0.5" : "1",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  borderRadius: "100%",
                  outline: "5px solid #f4ed38",
                  width: "4rem",
                  height: "4rem",
                  marginLeft: "1rem"
                }}
              >
                <img
                  alt="Profile"
                  src={
                    creatorData ? creatorData.displayPicture : ""
                  }
                  style={{
                    width: "4rem",
                    height: "4rem",
                  }}
                ></img>
              </div>
              {creatorData ? (
                creatorData.name === "" ? (
                  <span
                    className={chirping[6] ? "text" : "textOnHover"}
                    style={{
                      margin: "0rem 2rem",
                      fontSize: "24px",
                      letterSpacing: "2px",
                    }}
                    onClick={() => !chirping[6] && onClickName()}
                  >
                    {getEllipsisTxt(chirping[1], 6)}
                  </span>
                ) : (
                  <span
                    className={chirping[6] ? "text" : "textOnHover"}
                    style={{
                      margin: "0rem 2rem",
                      fontSize: "24px",
                      letterSpacing: "2px",
                    }}
                    onClick={() => !chirping[6] && onClickName()}
                  >
                    {creatorData.name}
                  </span>
                )
              ) : (
                <span
                  className="text"
                  style={{
                    margin: "0rem 2rem",
                    fontSize: "24px",
                    letterSpacing: "2px",
                  }}
                >
                  {getEllipsisTxt(chirping[1], 6)}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                alt="level"
                src={Level}
                style={{ width: "2rem", marginRight: "1rem" }}
              ></img>
              {creatorData ? (
                <span
                  className="text"
                  style={{ fontSize: "30px", marginRight: "2rem" }}
                >
                  {()=>Number(creatorData[8])}
                </span>
              ) : (
                <span
                  className="text"
                  style={{ fontSize: "30px", marginRight: "2rem" }}
                >
                  0
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
            }}
          >
            {chirpingImage ? (
              chirpingImage === "" ? (
                <span
                  className="text"
                  style={{ fontSize: "30px", marginTop: "1rem" }}
                >
                  {chirpingText}
                </span>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "2rem 0rem",
                  }}
                >
                  <img
                    alt="Chirping"
                    src={chirpingImage}
                    className="chirpingImage"
                  ></img>
                  <span
                    className="text"
                    style={{ fontSize: "26px", marginLeft: "3rem" }}
                  >
                    {chirpingText}
                  </span>
                </div>
              )
            ) : (
              <span
                className="text"
                style={{ fontSize: "30px", marginTop: "1rem" }}
              >
                {chirpingText}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "1.5rem 0rem",
            }}
          >
            <div
              className="text"
              style={{ fontSize: "15px" }}
              onClick={() => {
                console.log(()=>Number(chirping[3]));
              }}
            >
              <Moment
                date={()=>(Number(chirping)) * 1000}
                format="LLLL"
              ></Moment>
            </div>
            <div
              style={{
                display: "flex",
                width: "50%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginRight: "1rem",
              }}
            >
              <img
                alt="Cage"
                className={chirping[6] ? "logo" : "logoOnHover"}
                src={
                  cagesGivenTrue
                    ? RedCage
                    : chirpingIdArray2.includes(chirping[0])
                    ? RedCage
                    : Cage
                }
                style={{ width: "2.5rem", cursor: "pointer" }}
                onClick={() => {
                  !chirping[6] && onClickCage();
                }}
              ></img>
              <span
                className="text"
                style={{ margin: "0rem 1rem", fontSize: "40px" }}
              >
                {()=>Number(chirping[5])()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
              }}
            >
              <img
                alt="Wings"
                className={chirping[6] ? "logo" : "logoOnHover"}
                src={
                  wingsGivenTrue
                    ? WingsYellow
                    : chirpingIdArray.includes(chirping[0])
                    ? WingsYellow
                    : Wings
                }
                style={{ width: "5rem", cursor: "pointer" }}
                onClick={() => !chirping[6] && onClickWings()}
              ></img>
              <span
                className="text"
                style={{ margin: "0rem 1rem", fontSize: "40px" }}
              >
                {()=>Number(chirping[4])}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllChirpings;
