import Task from "../models/Task.js";

//getting the task
const getTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//creating the task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.user;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({ title, description, userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//updating the task
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { userId } = req.user;
    const { id } = req.params;

    //finding the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    //checking task belongs to this user or not
    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Invalid task",
      });
    }

    // now update the data
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete the task
const deleteTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    //finding task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "this is invalid" });
    }

    await task.deleteOne();
    res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//toggle the status
const toggleStatus = async(req, res)=>{
    try {
        const {userId} = req.user;
        const {id} = req.params;

        const task = await Task.findById(id);
        if(!task){
            res.status(404).json({message: "Task not found"});

        }

        if(task.userId.toString()!== userId){
           return res.status(403).json({message: "This task is invalid"});
        }
        //now toggle 
        task.status = task.status ==="pending"? "completed":"pending";
        const updatedTask = await task.save();
         res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {getTask, updateTask, createTask, deleteTask, toggleStatus};