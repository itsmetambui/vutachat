import React, { useState } from 'react';

import styles from './ChatForm.module.scss';

const ChatForm = ({onSubmit}) => {
  const [value, setValue] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if(!value) return; 

    try {
      onSubmit(value);
      setValue('');
    } catch(e) {
      alert(e);
    }
  }
  return (
    <form className={styles.ChatForm} onSubmit={handleSubmit}>
      <input
        id="newMessage"
        placeholder="Type a message..."
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        className={styles.Input}
        autoComplete="off"
      />

      <button className={styles.Button} type="submit">
        <span role="img" aria-label="emoji-submit">☝️</span>
      </button>
    </form>
  );
};

export default ChatForm;