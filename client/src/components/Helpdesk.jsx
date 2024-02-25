// ChatApp.js
import React, { useState } from "react";
import { ReactComponent as MailBox } from '../assets/inbox-alt-1-svgrepo-com.svg'
import { ReactComponent as Connection } from "../assets/share-circle-network-connection-social-svgrepo-com.svg";
import { ReactComponent as Friend } from "../assets/user-friends-svgrepo-com.svg";
import { ReactComponent as Graph } from "../assets/graph-increase-svgrepo-com.svg";
import img from "../assets/my photo 2.jpg";
import img1 from "../assets/align-left_10654774.png"
import pic from "../assets/picture.jpg";
import { ReactComponent as RefreshIcon } from "../assets/refresh-svgrepo-com.svg";
import { ReactComponent as CallIcon } from "../assets/call-alt-svgrepo-com.svg";
import { ReactComponent as ProfileIcon } from "../assets/user-profile-avatar-svgrepo-com.svg";
import AllMessages from "./AllMessages";
import { CHATS } from "../chats-data";
import './Helpdesk.styles.css'
import Chats from "./chats";
import axios from "axios";
let DATA = [];
const HelpDesk = () => {
  const [message, setMessage] = useState(DATA);
  const [chats, setChats] = useState(CHATS);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pid, setPid] = useState('');
  const [name, setName] = useState('');
  const status = 'Online';
  const [email, setEmail] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');

  const fetchmess = async () => {
    try {
      const response = await fetch('https://internassigment.onrender.com/api/getchat');
      const data = await response.json();
      for (const user of data.data) {
        const temp = (user.participants.data[0]);

        console.log(user.participants);
        const newObj = {
          id: temp.id,
          name: temp.name,
          email: temp.email,
          type: 'Facebook DM',
          time: '10m',
          heading: 'Hey Is this Available In Store',
          text: 'Yeah Sure, It is available in the store. You can visit the store and get it.'
        };

        const isDistinct = !DATA.some(obj => obj.id === newObj.id);

        if (isDistinct) {
          DATA.push(newObj);
        }
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchmess();

  const myId = localStorage.getItem("FB_PAGE_ID");
  console.log("myid", myId);

  async function fetchData(psid) {
    try {
      // console.log("Here is the PID", psid);

      if (psid === '')
        return [];
      const response = await fetch('https://internassigment.onrender.com/api/getchat');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const resp = await response.json();
      const data = resp.data;


      const getMessagesForParticipant = async (participantId) => {
        console.log("jahy", participantId);

        const participantData = await data.find(item =>
          item.participants.data.some(participant => participant.id === participantId)
        );
        if (participantData) {
          // Return the messages data for the participant
          console.log(participantData.messages.data);
          return participantData.messages.data;
        } else {
          // Participant not found
          return [];
        }
      };
      setPid(psid);
      const participantId = psid; // ID of the participant
      const dm_messages = await getMessagesForParticipant(participantId); // Await the async function call
      // Usage example 
      const dm_messages1 = await dm_messages.map((_, index, arr) => arr[arr.length - 1 - index]);

      console.log(dm_messages1);
      setChats(dm_messages1);

    } catch (error) {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  function convertGMTtoIST(gmtTimestamp) {
    const gmtDate = new Date(gmtTimestamp);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours offset for IST
    const istDate = new Date(gmtDate.getTime() + istOffset);

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = istDate.toLocaleTimeString('en-US', options);

    const optionsDate = { month: 'short', day: 'numeric' };
    const formattedDate = istDate.toLocaleDateString('en-US', optionsDate);

    return `${formattedDate}, ${formattedTime}`;
  }


  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
  const handleSetActiveMessage = (index, psid) => {
    setActiveMessageIndex(index); // Set the active message index
    fetchData(psid);
    // console.log(index)
  };



  const updname = (name, email, fname, lname) => {
    setName(name);
    setEmail(email);
    setFName(fname);
    setLName(lname);
  };

  const [navActiveTab, setNavActiveTab] = useState('mailbox'); // Initial active tab

  const handleNavTabClick = (tab) => {
    setNavActiveTab(tab); // Set the active tab when clicked
  };



  const handleKeyDown = async (event) => {
    const pageId = localStorage.getItem("FB_PAGE_ID")
    const pageAccessToken = localStorage.getItem("FB_PAGE_ACCESS_TOKEN")
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior of Enter key
      // Call your API or handle form submission here
      try {
        var response;
        if (pid) {
          response = await axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${pageAccessToken}`, {
            recipient: { id: pid },
            message: { text: inputMessage },
          }); // Send the message to the participant
        }
        else {
          console.log("pid is not present");
          return [];
        }

        console.log("response ke niche");
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Handle success response
        console.log('Message sent successfully');
        fetchData(pid);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
      event.target.value = '';
      setInputMessage(''); // Clear the input field after submission
    }
  };

  const handleChange = (event) => {
    setInputMessage(event.target.value);
  };


  return (
    <div className="container">
      <div className="nav-container">
        <ul className="nav-tabs">
          <li className={navActiveTab === 'connection' ? 'active-nav' : ''} onClick={() => handleNavTabClick('connection')}>
            <a href="#"><Connection /></a>
          </li>
          <li className={navActiveTab === 'mailbox' ? 'active-nav' : ''} onClick={() => handleNavTabClick('mailbox')}>
            <a href="#"><MailBox /></a>
          </li>
          <li className={navActiveTab === 'friend' ? 'active-nav' : ''} onClick={() => handleNavTabClick('friend')}>
            <a href="#"><Friend /></a>
          </li>
          <li className={navActiveTab === 'graph' ? 'active-nav' : ''} onClick={() => handleNavTabClick('graph')}>
            <a href="#"><Graph /></a>
          </li>
        </ul>
        <div className="profile-container">
          <div className="profile-image">
            <img src={img} alt="Profile" />
            <div className="status-dot"></div>
          </div>
        </div>
      </div>
      <div className="secondComponent">
        <div className="header">
          <div className="left_content">
            <img src={img1} alt="Menu" className="menu-icon" />
            <span className="conversation">Conversation</span>
          </div>
          <RefreshIcon className="refresh-icon" />
        </div>
        <div className="divider"></div>
        {message.map((data, index) => (<div onClick={() => handleSetActiveMessage(index, data.id)}><AllMessages name={data.name} type={data.type} time={data.time} heading={data.heading} text={data.text} isActive={index === activeMessageIndex} updatename={updname} email={data.email} /> </div>))}
      </div>
      <div className="thirdComponent">
        <div className="header">
          <span className="chat-heading font-bold">Chat</span>
        </div>
        <div className="divider"></div>
        <div className="chats">
          {chats.map(data => (<Chats name={data.from?.name} time={convertGMTtoIST(data.created_time)} text={data.message} img={pic} myChat={data.from?.id === myId} />))}
        </div>
        <div className="input-area"><input type="text" name="" id="input-area" placeholder="Message" onKeyDown={handleKeyDown} onChange={handleChange}
        /></div>
      </div>
      <div className="fourthComponent">
        <div className="profile-container1">
          <img src={img} alt="Avatar" className="profile-avatar" />
          <div className="profile-name"><b>{name}</b></div>
          {status === "Online" ? (<div className="full-profile-status">
            <div className="profile-status-dot-online"></div>
            <div className="profile-status">Online</div>
          </div>) :
            (<div className="full-profile-status">
              <div className="profile-status-dot-offline"></div>
              <div className="profile-status">Offline</div>
            </div>)}
          <div className="profile-buttons">
            <button className="call-button"><CallIcon />Call</button>
            <button className="profile-button"><ProfileIcon />Profile</button>
          </div>
        </div>
        <div className="divider profile-divider"></div>
        <div className="profile-details">
          <div className="details-box">
            <div className="details">
              <h4 className="details-header">Consumer Details</h4>
              <div className="detail">
                <div className="detail-heading">
                  Email
                </div>
                <div className="detail-value detail-email">{email.slice(0, 20)}</div>
              </div>
              <div className="detail">
                <div className="detail-heading">
                  First Name
                </div>
                <div className="detail-value">{fName}</div>
              </div>
              <div className="detail">
                <div className="detail-heading">
                  Last Name
                </div>
                <div className="detail-value">{lName}</div>
              </div>
              <a className="more-details" href="#">View more details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpDesk;

