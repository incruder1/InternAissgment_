
import express from 'express';
const router = express.Router();
import Conversation from '../models/chatModel.js';
 import axios from 'axios';
 
var pageId, token;
 router.post("/sendData", (req, res) => {
    const receivedData = req.body;
    pageId = receivedData.id;
    token = receivedData.pageAccessToken;
    res.json({ message: "Data received successfully!" });
  });
 router.get("/getchat", async (req, res) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${pageId}/conversations?fields=participants,messages{id,message,created_time,from}&access_token=${token}`
      );
  
      const data = response.data;
      for (const conversation of data.data) {
        const existingUser = await Conversation.findOne({
          id: conversation.participants.data[0].id,
        });
  
        if (existingUser) {
          await Conversation.deleteMany({ id: conversation.participants.data[0].id });
        }
  
        let chats = [];
        for (const message of conversation.messages.data) {
          const chat = {
            sender_id: message.from.id,
            sender_name: message.from.name,
            message: message.message,
            created_time: message.created_time,
          };
          chats.push(chat);
        }
  
        const newChat = new Conversation({
          id: conversation.participants.data[0].id,
          name: conversation.participants.data[0].name,
          email: conversation.participants.data[0].email,
          messages: chats,
        });
  
        await newChat.save();
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in processing Facebook data:", error);
  
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
  
      res.status(500).json({ message: "Internal Server Error" });
    }
  }); 
export default router;
