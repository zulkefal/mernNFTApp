import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import NavigationBar from "./component/NavigationBar";
import Login from "./component/Authentication/Login";
import Signup from "./component/Authentication/Signup";
import MainDash from "./component/DashBoard/MainDash";
import { SnackbarProvider } from "notistack";
import GenerateNFT from "./component/DashBoard/Dash-functions/GenerateNFT";
import MintNFT from "./component/DashBoard/Dash-functions/MintNFT";
import IPFS from "./component/DashBoard/Dash-functions/IPFS";
import TicketsDB from "./component/DashBoard/Dash-functions/TicketsDB";

function App() {
  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<MainDash />} />
          <Route path="/mintNFT" element={<MintNFT />} />
          <Route path="/ipfs" element={<IPFS />} />
          <Route path="/ticketsDB" element={<TicketsDB />} />

        </Routes>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
