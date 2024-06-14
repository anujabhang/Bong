import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

//POST Register
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    //Validations
    if (!name) {
      return res.send({ error: "name Required" });
    }
    if (!email) {
      return res.send({ error: "email Required" });
    }
    if (!password) {
      return res.send({ error: "password Required" });
    }
    if (!phone) {
      return res.send({ error: "phone Required" });
    }
    if (!address) {
      return res.send({ error: "address Required" });
    }

    //Check User
    const existingUser = await userModel.findOne({ email });
    //if User already present
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Registered, Please Login",
      });
    }
    //register user

    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    }).save();
    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: " An Error occured Registration",
      error,
    });
  }
};

// POST Login

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid Email or Password" });
    }

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).send({
            success:false, message:"Email not Registered"
        })
        
    }

    const match = await comparePassword(password, user.password);
    
    if(!match){
        return res.status(404).send({
            success:false, message:"Invalid Password"
        })
    }

    //token
    const token = await JWT.sign({_id:user._id}, process.env.JWT_Secret, {
        expiresIn:"7d"
    });

    res.status(200).send({
        succes:true,
        message:"User Login Succesfull",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
        },
        token,
        match
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An Error occured during Login",
      error,
    });
  }
};

export { registerController, loginController };
