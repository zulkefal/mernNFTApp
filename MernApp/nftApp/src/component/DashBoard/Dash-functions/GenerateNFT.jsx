import React, { useEffect, useState } from "react";
import "./GenerateNFT.css";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";

const GenerateNFT = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [usID, setUserID] = useState(() => {
    return userId || localStorage.getItem('userId');
  });

  useEffect(() => {
    if (usID) {
      localStorage.setItem('userId', usID);
    }
  }, [usID]);


  let [color, setColor] = useState("#FFFFFF	");
  const [formData, setFormData] = useState({
    ticketID: "",
    eventDate: "",
    eventName: "",
    eventLocation: "",
    issuerName: "",
    participantName: "",
    ticketType: "",
    address: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const [imgHash, setImgHash] = useState("");
  const [file, setFile] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [jsonHash, setJsonHash] = useState("");


  const handleImage = async (event) => {
    event.preventDefault();
    setLoading(true);
    const img = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevState) => ({ ...prevState, image: reader.result }));
    };

    if (img) {
      reader.readAsDataURL(img);
      setFormData((prevState) => ({ ...prevState, image: img }));
      setFile(img);
      try {
        const imgdata = new FormData();
        imgdata.append("file", img);
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: imgdata,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
          },
        });
        // console.log("IPFS hash:", response.data.IpfsHash);
        setImgHash(response.data.IpfsHash);
        enqueueSnackbar("Image Stored on IPFS", {
          autoHideDuration: 3000,
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } catch (e) {
        console.error("Error uploading to IPFS:", e);
        enqueueSnackbar("Error uploading to IPFS", {
          autoHideDuration: 3000,
          variant: "error",

          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } else {
      setFormData((prevState) => ({ ...prevState, image: null }));
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleData = async () => {
    setLoading1(true);
    console.log("Loading1:", loading1);

    try {
    

      const jsonFile = {
        image: "https://orange-solid-cattle-398.mypinata.cloud/ipfs/" + imgHash,
        attributes: [
          { trait_type: "Ticket ID", value: formData.ticketID },
          { trait_type: "Event Date", value: formData.eventDate },
          { trait_type: "Event Location", value: formData.eventLocation },
          { trait_type: "Event Name", value: formData.eventName },
          { trait_type: "Participant Name", value: formData.participantName },
          { trait_type: "Issuer Name", value: formData.issuerName },
          { trait_type: "Ticket Type", value: formData.ticketType },
          { trait_type: "Address", value: formData.address },
        ],
      };
      
      const participantName = formData.participantName;
    

      try {
        if(!usID){
          enqueueSnackbar("User Id Missing", {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });

          return;
        }
        const jsonBlob = new Blob([JSON.stringify(jsonFile)], {
          type: "application/json",
        });
        
        const formData1 = new FormData();
        formData1.append("file", jsonBlob, `${participantName}.json`);

        const responseJson = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData1,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
          },
        });
        console.log("IPFS hash for JSON:", responseJson.data.IpfsHash);
        setJsonHash(responseJson.data.IpfsHash);
       
        if(responseJson.data.IpfsHash)
        {
          enqueueSnackbar("JSON Stored on IPFS", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });

          // add data to database
          try{

            const addNftData = await fetch("http://localhost:9000/api/addData/addNftData", {
              method: "Post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                ticketID: formData.ticketID,
                eventDate: formData.eventDate,
                eventName: formData.eventName,
                eventLocation: formData.eventLocation,
                issuerName: formData.issuerName,
                participantName: formData.participantName,
                ticketType: formData.ticketType,
                address: formData.address,
                imageHash: "https://orange-solid-cattle-398.mypinata.cloud/ipfs/" + imgHash,
                jsonFile: responseJson.data.IpfsHash,
                createdBy:userId,
                nftStatus: false,
              }),
            });
            console.log("see after body")
            console.log(formData.ticketID, formData.eventDate, formData.eventName, formData.eventLocation, formData.issuerName, formData.participantName, formData.ticketType, formData.address)
            
            const response = await addNftData.json();
            if (response.message === "NFT Data Stored") {
              // console.log("Data Added to Database Successfully:", response);
              enqueueSnackbar('Data Added to Database Successfully', {
                autoHideDuration: 3000,
                variant:"success",
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                }
              })
            } else {
              console.error("Data Not Added to Database:", response);
              enqueueSnackbar(`Data Not Added to Database + ${response.error}`, {
                autoHideDuration: 3000,
                variant:"error",
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                }
              })
            }
          }
          catch(e){
            console.error("Data Not Added to Database:", e);
            enqueueSnackbar(`Data Not Added to Database + ${response.error}`, {
              autoHideDuration: 3000,
              variant:"error",
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
              }
            })
          }
        }
        else{
          enqueueSnackbar("Error in Storing JSON on IPFS", {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          
          });
        }
      } catch (err) {
        enqueueSnackbar(`Error in Storing JSON on IPFS ${err}`, {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        
        });      }
    } catch (e) {
      //error in creating  json
      enqueueSnackbar(`Error in creating Json FrontEnd ${e}`, {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      
      });
    }
   
    setLoading1(false);
  };
  return (
    <>
      <div className="generateNFT">
        <div className="imageNFT">
          {formData.image && <img src={formData.image} alt="Ticket" />}
          <input
            type="file"
            accept="image/*"
            id="img"
            name="img"
            required
            onChange={handleImage}
          />
          {loading && (
            <ClipLoader
              color={color}
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
          {imgHash && (
            <a
              className="ipfshash"
              target="_blank"
              href={`https://ipfs.io/ipfs/${imgHash}`}
            >
              IPFS Hash: {imgHash}
            </a>
          )}
        </div>
        <div className="fields">
          <div className="row">
            <input
              className="inputField"
              type="text"
              required
              placeholder="Ticket ID"
              onChange={handleChange}
              name="ticketID"
            />
            <input
              className="inputField"
              type="date"
              required
              placeholder="Event Date"
              onChange={handleChange}
              name="eventDate"
            />
          </div>
          <div className="row">
            <input
              className="inputField"
              type="text"
              required
              placeholder="Event Name"
              onChange={handleChange}
              name="eventName"
            />
            <input
              className="inputField"
              type="text"
              required
              placeholder="Event Location"
              onChange={handleChange}
              name="eventLocation"
            />
          </div>
          <div className="row">
            <input
              className="inputField"
              type="text"
              required
              placeholder="Issuer Name"
              onChange={handleChange}
              name="issuerName"
            />
            <input
              className="inputField"
              type="text"
              required
              placeholder="Participant Name"
              onChange={handleChange}
              name="participantName"
            />
          </div>
          <div className="row">
            <input
              className="inputField"
              type="text"
              required
              placeholder="Ticket Type"
              onChange={handleChange}
              name="ticketType"
            />
            <input
              className="inputField"
              type="text"
              required
              placeholder="Address"
              onChange={handleChange}
              name="address"
            />
          </div>

          <div className="loader">
            <button onClick={handleData}>Submit</button>
            {loading1 && (
              <ClipLoader
                color={color}
                loading={loading1}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
                className="loader"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateNFT;
