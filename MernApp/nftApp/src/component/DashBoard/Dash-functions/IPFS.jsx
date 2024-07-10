import React from 'react'
import './Ipfs.css'
import SideBar from '../SideBar'

const IPFS = () => {
  return (
    <div className="mainDash">
      <div className="dash-header">
        <h4>Welcome to Ticketing System</h4>
      </div>
      <div className="dash2">
        <div className="sidebar">
        <SideBar/>
        </div>
        <div className="content">
          <h1>Hello I am from IPFS</h1>
        </div>
      </div>
    </div>
  )
}

export default IPFS