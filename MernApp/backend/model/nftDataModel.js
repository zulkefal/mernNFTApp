const mongoose = require("mongoose");

const newNFTdataModel = new mongoose.Schema({
    ticketID:{
        type: Number,
        required: true
    },
    eventDate:{
        type: 'string',
        required: true
    },
    eventName:{
        type: 'string',
        required: true
    }
    ,
    eventLocation:{
        type: 'string',
        required: true
    },
    issuerName:{
        type: 'string',
        required: true
    },
    participantName:{
        type: 'string',
        required: true
    },
    ticketType:{
        type: 'string',
        required: true
    },
    address:{
        type: 'string',
        required: true
    },
    imageHash:{
        type: 'string',
        required: true
    },
    jsonFile:{
        type: 'string',
        required: true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newusers",
        required:true
    },
    nftStatus:{
        type: Boolean,
        required:true
    }
},{timestamps:true});

const newNFTdata = mongoose.model("nftData",newNFTdataModel);

module.exports = newNFTdata;