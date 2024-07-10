import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'
const SideBar = () => {
  return (
   <>
          <div className='sss'>
          <ul>
            <br />
            <br />
            <li>
              <Link to="/dashboard">Generate Ticket</Link>
            </li>
            <br />
            <li>
              <Link to="/mintNFT">Mint Tickets</Link>
            </li>
            <br />
      
            <li>
              <Link to="/ticketsDB">Tickets DB</Link>
            </li>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <li>
              {" "}
              <Link to="/">Log Out</Link>
            </li>{" "}
          </ul>
          </div>
      </>
  )
}

export default SideBar