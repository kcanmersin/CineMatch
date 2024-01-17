import React from "react";

const UserCard = ({ id, username, rate_ratio, profile_picture }) => (
  <div key={username} className="user-card">
    <img src={profile_picture} alt={username} className="user-card-image" />
    <div className="user-card-body">
      <div className="user-card-username">{username}</div>
      <div className="user-card-number">{rate_ratio}</div>
    </div>
  </div>
);

export default UserCard;
