import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import Chat from "./models/chatModel.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 8080;
//configure env
dotenv.config();

//databse config
connectDB();

// //esmoduleFix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
//routes
app.use("/api/v1/auth", authRoutes);

var pageId, token;
app.post('/api/sendData', (req, res) => {
  const receivedData = req.body;
  pageId = receivedData.id;
  token = receivedData.pageAccessToken;
  res.json({ message: 'Data received successfully!' });
});

app.get("/api/getchat", async (req, res) => {
   
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}/conversations?fields=participants,messages{id,message,created_time,from}&access_token=${token}`
    );
    
    const data = response.data;
    console.log(data.data[0].participants.data[0].id + " " + data.data[0].participants.data[0].name + " " + data.data[0].participants.data[0].email + "-------------------------------------------------------");

    for (const conversation of data.data) {
      const existingUser = await Chat.findOne({ id: conversation.participants.data[0].id });
      
      if (existingUser) {
        await Chat.deleteMany({ id: conversation.participants.data[0].id });
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

      const newChat = new Chat({
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

// rest api

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// PORT


//run listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
