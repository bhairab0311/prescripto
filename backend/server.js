import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
//app config
const app = express();
const port = process.env.PORT || 4000 ;
connectDB();
connectCloudinary();



//middleware
app.use(express.json())
app.use(cors());

//api endpoints
app.use('/api/admin' , adminRouter);


app.get('/' , (req,res)=>{
    res.send("api working hi");
})

app.listen(port , ()=> console.log("server started ", port));
