const express = require("express")
const {connectDB} = require("./connection")

const app = express();
const port = 9000;
var cors = require('cors')

var corsOptions = {
    origin: 'http://localhost:5173',
    methods:"GET, POST, PUT, DELETE",
    credentials:true
  }

app.use(cors(corsOptions))
app.use(express.json());
app.use('/api/auth',require('./routes/AuthenticationRoutes'))
app.use('/api/addData',require('./routes/AuthenticationRoutes'))
app.use('/api/getData',require('./routes/AuthenticationRoutes'))
app.use('/api/updateNft',require('./routes/AuthenticationRoutes'))
app.use('/api/mintedData',require('./routes/AuthenticationRoutes'))



// addd database link below
connectDB("mongodb://127.0.0.1:27017/")
.then(()=>{
    console.log("Connected to DB")
})
.catch(err => console.log(err))

app.listen(port,()=>{
    console.log(`Server connected at port ${port}`)
});