import React from 'react'
import { useState, useEffect } from 'react';
import { ReactComponent as MailBox } from '../assets/inbox-alt-1-svgrepo-com.svg'
import { ReactComponent as Connection } from "../assets/share-circle-network-connection-social-svgrepo-com.svg";
import { ReactComponent as Friend } from "../assets/user-friends-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { ReactComponent as Graph } from "../assets/graph-increase-svgrepo-com.svg";
import img from "../assets/my photo 2.jpg";
import { LogIn } from 'lucide-react';
function FirstComponent() {
    const [navActiveTab, setNavActiveTab] = useState('mailbox');
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("FB_ACCESS_TOKEN");
        localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
        localStorage.removeItem("FB_PAGE_ID");
        localStorage.removeItem("FB_PAGE_DETAILS");
        window.location = '/connect';
    }
    const handleNavTabClick = (tab) => {
        setNavActiveTab(tab); // Set the active tab when clicked
    };
    const closeSubMenu = () => {
        setIsSubMenuOpen(false);
    };
    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
         
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest(".submenu-container")) {
                setIsSubMenuOpen(false);
            }
        };

        if (isSubMenuOpen) {
            window.addEventListener("click", handleOutsideClick);
        }

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [isSubMenuOpen]);
    const iconStyle = ["Connection", "MailBox", "Friend", "Graph"]

    return (

        <div className="nav-container">
            <ul className="nav-tabs">
                <li key="1" className={navActiveTab === 'connection' ? 'active-nav' : ''} onClick={() => handleNavTabClick('connection')}>
                    <a href="#"><Connection /></a>
                </li>
                <li key="2" className={navActiveTab === 'mailbox' ? 'active-nav' : ''} onClick={() => handleNavTabClick('mailbox')}>
                    <a href="#"><MailBox /></a>
                </li>
                <li key="3" className={navActiveTab === 'friend' ? 'active-nav' : ''} onClick={() => handleNavTabClick('friend')}>
                    <a href="#"><Friend /></a>
                </li>
                <li key="4" className={navActiveTab === 'graph' ? 'active-nav' : ''} onClick={() => handleNavTabClick('graph')}>
                    <a href="#"><Graph /></a>
                </li>
            </ul>
            <div className="profile-container  submenu-container">
                <div className="profile-image">
                    <img src={img} alt="Profile" onClick={toggleSubMenu} />
                    <div className="status-dot"></div>
                    {/* <div className="absolute bottom-0 right-1/3 bg-green-500 w-3 h-3 rounded-full"></div> */}
                    {isSubMenuOpen && (
                        <div
                            className="absolute -top-20 left-5 w-25 bg-white border border-gray-300 rounded-lg shadow-lg"
                            onClick={closeSubMenu}
                        >

                            <p className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                                onClick={handleLogout}>Logout</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default FirstComponent