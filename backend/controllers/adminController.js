import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'



// //API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ succcess: false, messsage: "Missing Details" });
    }

    //validating for email format
    if (!validator.isEmail(email)) {
      return res.json({
        succcess: false,
        messsage: "Please enter a valid email",
      });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        succcess: false,
        messsage: "Please enter a strong password",
      });
    }

    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    }

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save()
    
    res.json({succcess:true , message: "Doctor addedd"})

  } catch (error) {
    console.log(error)
    res.json({succcess:false,message : error.message})
  }
};









//API for admin login
const loginAdmin = async (req,res) => {
    try{


      const {email , password} = req.body;


     if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
       const token = jwt.sign(email+password , process.env.JWT_SECRET)
       res.json({success: true,token})
    }else{
        res.json({success:false , message: "Invalid credentials"})
    }


    }catch{
        console.log(error);
        res.json({success:false , message: error.message})
    }
}

export { addDoctor , loginAdmin};



























// const addDoctor = async (req, res) => {
//   try {
//     const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
//     const imageFile = req.file;

//     console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile);

//     res.status(201).json({ message: "Doctor received" }); // ✅ Send response
//   } catch (error) {
//     console.error("Error in addDoctor:", error);
//     res.status(500).json({ error: "Server error" }); // ✅ Send error response
//   }
// };

// export { addDoctor };
