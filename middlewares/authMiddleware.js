import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
//Protected Routes token base
const requireSignIn = async (req, res, next) => {
  try {
    const decode =  JWT.verify(
      req.headers.authorization,
      process.env.JWT_Secret
    );
    req.user =  decode;//decrypt
    next();
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){

            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        }else{
            next();
        }
    }catch(error){
        res.status(401).send({
            success: false,
            message: "Error in Admin MiddleWare",
            
        })
    }
}

export {requireSignIn, isAdmin};
