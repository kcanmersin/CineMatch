import React from "react";

const UserCard = ({ id, username, percentage, image }) => (
  <div key={id} className="user-card">
    <img src={image} alt={username} className="user-card-image" />
    <div className="user-card-body">
      <div className="user-card-username">{username}</div>
      <div className="user-card-number">{percentage}</div>
    </div>
  </div>
);

export default UserCard;
