import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../../assets/login.png";
import connectWallet from "../DashBoard/ConnectWallet";
import ClipLoader from "react-spinners/ClipLoader";
import { useSnackbar } from 'notistack'
import NavigationBar from "../NavigationBar";

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [addressStatus, setAddressStatus] = useState("Connect Wallet");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const connectMetamask = async (event) => {
    event.preventDefault();
    const signerObject = await connectWallet();
    const signerAddress = signerObject.address;
    setAddress(signerAddress);
    console.log(signerAddress);
    setAddressStatus("Wallet Connected");
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const signupRequest = await fetch(
        "http://localhost:9000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            email,
            password,
          }),
        }
      );

      if (signupRequest.ok) {
        const response = await signupRequest.json();
        console.log("Signup successful:", response);
        enqueueSnackbar('Signed Up Successfully ', {
          autoHideDuration: 3000,
          variant:"success"
        })
        navigate("/login");
      } else {
        console.error("Signup failed:", signupRequest.statusText);
        enqueueSnackbar(signupRequest.statusText, {
          autoHideDuration: 3000,
          variant:"warning"
        })
      }
    } catch (error) {
      console.error("Error during signup:", error);
      enqueueSnackbar(error, {
        autoHideDuration: 3000,
        variant:"warning"
      })
    }

    setPassword('');
    setAddress('');
    setEmail('');
    setAddressStatus('Connect Wallet');
    setLoading(false);

  };
  let [color, setColor] = useState("#FFFFFF	");

  return (
    <>
    <NavigationBar/>
      <div className="login-main">
        <div className="form-side">
          <form onSubmit={handleSignup}>
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
            <button type="submit" className="connect-wallet">Sign Up</button>
            <Link to="/Login">
              <label className="for-signIn">Existing User? Sign In</label>
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
        <div className="img-side">
          <img src={LoginImg} alt="login" />
        </div>
      </div>
    </>
  );
};

export default Signup;
