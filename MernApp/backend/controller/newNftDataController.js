const newNFTdata = require("../model/nftDataModel");

const addNftData = async (req,res) =>{
    const { ticketID, eventDate,eventName,eventLocation,issuerName,participantName,ticketType,address,imageHash,jsonFile,createdBy,nftStatus } = req.body;
    console.log("from req",req.body);

    if(!ticketID || !eventDate || !eventName || !eventLocation || !issuerName || !participantName || !ticketType || !address ||!jsonFile ||!createdBy ||!imageHash){
        return res.status(400).json({message:"All fields are required"});
    }
    else{
        console.log(req.body);
        try{
            const newData= await newNFTdata.create({
                ticketID,
                eventDate,
                eventName,
                eventLocation,
                issuerName,
                participantName,
                ticketType,
                address,
                imageHash,
                jsonFile,
                createdBy,
                nftStatus
            });
            if (newData) {
                res.status(200).json({ message: 'NFT Data Stored', newData });
            }
        }
        catch(error){
            console.error("Error in addNftData:",error);
            res.status(500).json({message:"Error in addNftData",error});
        }
    }
}
const getData = async (req, res) => {
    try {
      const findData = await newNFTdata.find({ nftStatus: false });
      if (findData) {
            res.status(200).json({ data: findData });
        }
    } catch (error) {
        console.error("Error in getData:", error);
        res.status(500).json({ message: "Error in getData", error });
    }
}

const UpdateNFTdata = async (req, res) => {
    const { ticketID } = req.params;
    console.log(`Updating NFT for ticketID: ${ticketID}`);
    try {
      const updateData = await newNFTdata.findOneAndUpdate(
        { ticketID: ticketID },
        { nftStatus: true },
        { new: true }
      );
  
      if (updateData) {
        res.status(200).json({ message: "Updated" });
      } else {
        console.error(`NFT with ticketID ${ticketID} not found`);
        res.status(404).json({ message: "NFT not found" });
      }
    } catch (err) {
      console.error('Error during NFT update:', err);
      res.status(500).json({ error: err.message });
    }
  };

  const getMintedNftData = async (req, res) => {
    try {
      const mintedData = await newNFTdata.find({ nftStatus: true });
      if (mintedData) {
            res.status(200).json({ data: mintedData });
        }
    } catch (error) {
        console.error("Error in getMintedNftData:", error);
        res.status(500).json({ message: "Error in getMintedNftData", error });
    }
}


module.exports ={addNftData,getData,UpdateNFTdata,getMintedNftData};