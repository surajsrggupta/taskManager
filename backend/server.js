import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"

const app = express();
app.use(cors());
app.use(express.json())

connectDB();

//routes
app.use("/api/auth",authRoutes);
app.use("/api/tasks", taskRoutes)


app.get("/", (req, res)=>{
    res.send('Task Manager API Running! 🚀');
})



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT} 🟢`);
})