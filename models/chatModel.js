import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
  id : String,
  name : String,
  email : String,
  messages: [{
    sender_id : String,
    sender_name : String,
    message : String,
    created_time : String,
  }],
});

export default mongoose.model("Chat", ChatSchema);
