import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  pageId: String, 
  conversationId: String, 
  messages: [
    { 
      message: String,
      id: String,
      created_time:String,
      from: mongoose.Schema.Types.Mixed,
      to: mongoose.Schema.Types.Mixed,
    },
  ],
  participants:[
      {
        email: String,
        name: String,
        id: String
      }
  ]
});

export default mongoose.model("Conversation", conversationSchema);
 