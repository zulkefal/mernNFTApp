import React, { useState } from "react";
import LoginImg from "../../assets/login.png";
import "./Login.css";
import connectWallet from "../DashBoard/ConnectWallet";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarProvider, useSnackbar } from 'notistack'
import NavigationBar from "../NavigationBar";
import { useNavigate } from "react-router-dom";
const Login = () => {
  let [color, setColor] = useState("#FFFFFF	");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const navigate =useNavigate()
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAdress] = useState("");
  const [addressStatus, setAddressStatus] = useState("Connect Wallet");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const connectMetamask = async (event) => {
    event.preventDefault();
    const signerObject = await connectWallet();
    const signerAddress = signerObject.address;
    setWalletAdress(signerAddress);
    console.log(signerAddress);
    setAddressStatus("Wallet Connected");
  };
  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    try{
      const signInReq = await fetch("http://localhost:9000/api/auth/signIn", {
        method: "Post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
      
          walletAddress,
          email,
          password,
        }),
      });
    const response = await signInReq.json();
    if (signInReq.ok) {
      console.log("SignIn successful:", response);
      setUserID(response._id);
      enqueueSnackbar('Credentials Correct', {
        autoHideDuration: 3000,
        variant:"success"
        ,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
      })
      console.log("userID Sent", response.findUser._id);

      navigate("/dashboard",{ state: { userId: response.findUser._id } })
    } else {
      console.error("Signup failed:", signInReq);
      enqueueSnackbar(response, {
        variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                }
      })
    }
  }
  catch (err) {
    console.error("Error during signup:", err);

  }
    setPassword('');
    setWalletAdress('');
    setEmail('');
    setAddressStatus('Connect Wallet');
    setLoading(false);
  };
  return (
   <>
    <NavigationBar/>
    <div className="login-main">
      <div className="img-side">
        <img src={LoginImg} alt="login" />
      </div>
      <div className="form-side">
        <form onSubmit={handleSignIn}>
          <button className="connect-wallet" onClick={connectMetamask}>
            {addressStatus}
          </button>
          <input
            type="email"
            required
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="connect-wallet">Sign In</button>
          <Link to="/signup">
            <label className="for-signup">New User? Sign UP</label>
          </Link>
        </form>
        {loading && <ClipLoader
            color={color}
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />}
      </div>
    </div>
   </>
  );
};

export default Login;
