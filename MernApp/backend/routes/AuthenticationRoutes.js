const express = require("express");
const { handleSignUp,handleSignIn } = require("../controller/UserController");
const {addNftData,getData,UpdateNFTdata,getMintedNftData} = require("../controller/newNftDataController"); 

const router = express.Router();

router.post('/signup', handleSignUp);
router.post('/signIn', handleSignIn);
router.post('/addNftData', addNftData);
router.get('/getNftData', getData);
router.post('/updateNftData/:ticketID', UpdateNFTdata);
router.get('/getMintedData', getMintedNftData);




module.exports = router;
