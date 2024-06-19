import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

//POST Register
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    //Validations
    if (!name) {
      return res.send({ message: "name Required" });
    }
    if (!email) {
      return res.send({ message: "email Required" });
    }
    if (!password) {
      return res.send({ message: "password Required" });
    }
    if (!phone) {
      return res.send({ message: "phone Required" });
    }
    if (!address) {
      return res.send({ message: "address Required" });
    }

    //Check User
    const existingUser = await userModel.findOne({ email });
    //if User already present
    if (existingUser) {
      return res.status(200).send({
        success: false,
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

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not Registered",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_Secret, {
      expiresIn: "7d",
    });

    res.status(200).send({
      succes: true,
      message: "User Login Successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An Error occured during Login",
      error,
    });
  }
};

const testController = async (req, res) => {
  res.send("protected route");
};

export { registerController, loginController, testController };
