import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const protect = async(req, res, next)=>{
    try {
        // token in header or not
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Token not found ,please login. ' 
      });
    }

    const token = authHeader.split(" ")[1];

    //verify token 
    const {payload} = await jwtVerify(token, JWT_SECRET);

    //attach with req.user
    // req.user = {userId: payload.user.id};
    req.user = {userId: payload.userId};
    

    next();

    } catch (error) {
        return res.status(401).json({ 
      message: 'Token invalid or expire, please login' 
    });
  
    }
}
export default protect;