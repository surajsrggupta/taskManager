import mongoose, {Schema, model} from "mongoose";

const TaskSchema = new Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },

},{ timestamps: true })

const Task = model("Task", TaskSchema);
export default Task;