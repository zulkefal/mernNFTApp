import React from "react";
import "./MainDash.css";
import { Link } from "react-router-dom";
import GenerateNFT from "./Dash-functions/GenerateNFT";
import SideBar from "./SideBar";

const MainDash = () => {
  return (
    <div className="mainDash">
      <div className="dash-header">
        <h4>Welcome to Ticketing System</h4>
      </div>
      <div className="dash2">
        <div className="sidebar">
        <SideBar />
        </div>
        <div className="content">
          <GenerateNFT />
        </div>
      </div>
    </div>
  );
};

export default MainDash;
