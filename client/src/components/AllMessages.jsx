import React from "react";
import "./allMessages.styles.css";
const AllMessages = ({ id, name, type, time, heading, text, isActive, updatename, email }) => {

    const trimmedHeading = heading.length > 25 ? heading.slice(0, 25) + "..." : heading;
    const trimmedText = text.length > 30 ? text.slice(0, 48) + "..." : text;
    const fullName = name;

    // Split the full name into an array of words
    const nameArray = fullName.split(' ');

    // Extract the first and last names
    const firstName = nameArray[0];
    const lastName = nameArray[nameArray.length - 1];
    return (
        <div className={`content ${isActive ? 'active' : ''}`} onClick={() => updatename(name, email, firstName, lastName)}>
            <div className="checkbox-wrapper">
                <input type="checkbox" id="checkbox" />
                <div className="label">
                    <b><div className="name">{name}</div></b>
                    <b><div className="type">{type}</div></b>
                </div>
                <div className="time">{time}</div>
            </div>
            <div className="down">
                <div className="heading">{trimmedHeading}</div>
                <div className="subHeading">{trimmedText}</div>
            </div>

        </div>
    );
}

export default AllMessages;