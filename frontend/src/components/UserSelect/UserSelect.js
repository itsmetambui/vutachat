import React, { useState } from 'react';

const UserSelect = ({users, onChange}) => {
  const [currentUser, setCurrentUser] = useState(users[0]);

  const handleClicked = (user) => {
    if(currentUser === user) return;
    setCurrentUser(user);
    onChange(user);
  };

  return (
    <ul className="flex flex-column flex-1 list-unstyled user-list">
      {users.map(user => <li key={user._id}>
        <button className="block relative" onClick={() => handleClicked(user)}>
          <img src={user.avatar} alt={user.email} className="avatar" />
          <span className="absolute username">{user.email}</span>
        </button>
      </li>)}
    </ul>
  );
};

export default UserSelect;