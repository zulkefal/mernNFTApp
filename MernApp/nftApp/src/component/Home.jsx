import React from 'react'
import './Home.css'
import nftImg from "../assets/nftImg.png";
import NavigationBar from './NavigationBar';

const Home = () => {
  return (
<>
<NavigationBar/>
<div className="body">
    <div className="heading"><h1><span>Create Ticket as <br /> Non Fungible</span> <br /> Token</h1></div>
    <div className="img-nft">
      <img src={nftImg} alt="" />
    </div>
    </div> 
</>
     )
}
export default Home