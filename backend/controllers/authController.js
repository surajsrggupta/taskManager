import User from "../models/User.js";
import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";

//secret key 
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// token creating functin

const generateToken = async(userId)=>{
  const generatedToken = await new SignJWT({ userId:userId.toString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  
  return generatedToken;
}


// User registration hai yeh 
export const register = async(req, res)=>{
try {
    const {email, name, password} = req.body;
    
    //validating
     if (!name || !email || !password) {
          return res.status(400).json({
            message: 'All fields are required. '
          });
        }
    
    
    //user exists or not
    
    const existingUser = await User.findOne({email});
    if(existingUser){
          return res.status(400).json({
            message: 'Email already registered'
          });
    }
    
    //hashing the password 
    const hashPass = await argon2.hash(password);
    
    // creating user
    const user = await User.create({
        name, email, password:hashPass,
    })
    
    // now token creation 
    const token = await generateToken(user._id.toString());
    
    
    res.status(201).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
    })
} catch (error) {
     res.status(500).json({ message: error.message });
}
}

// user login 

export const login = async(req, res)=>{
    try {
      const { email, password } = req.body;

      //checking the user
      if (!email || !password) {
        return res.status(400).json({
          message: "Fields are required",
        });
      }

      // find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Email or password Wrong",
        });
      }

      //check password - verify
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Email or password Wrong",
        });
      }

      // generate token

      const token = await generateToken(user._id.toString());
      // console.log("Token type:", typeof token); 
      // console.log("Token value:", token); 
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}