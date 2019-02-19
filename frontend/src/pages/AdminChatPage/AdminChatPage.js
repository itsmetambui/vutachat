import React from 'react';

const AdminChatPage = () => {
  return (
    <div>
      ADMIN CHAT
    </div>
  );
};

export default AdminChatPage;
// import React, { useState, useEffect } from 'react';
// import cx from 'classnames';
// import PerfectScrollbar fADMIN CHATrom 'react-perfect-scrollbar'

// import client from '../../feathers';

// import ChatBox from '../../components/ChatBox/ChatBox';
// import ChatForm from '../../components/ChatForm/ChatForm';

// import styles from './AdminChatPage.module.scss'

// const messageService = client.service('messages');
// const userService = client.service('users');

// const AdminChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);

//   useEffect(function fetchData() {
//     Promise.all([
//       messageService.find({
//         query: {
//           $sort: { createdAt: -1 },
//           $limit: 25
//         }
//       }),
//       userService.find()
//     ]).then( ([ messagePage, userPage ]) => {
//       setMessages(messagePage.data.reverse());
//       setUsers(userPage.data);
//     });
//   }, []);

//   useEffect(function addUserCreatedListener() {
//     const onUserCreated = user => setUsers(users => [...users, user]);
//     userService.on('created', onUserCreated);
//     return function removeListener() {
//       userService.removeListener('created', onUserCreated);
//     };
//   }, []);

//   useEffect(function addMessageCreatedListener() {
//     const onMessageCreated = message => setMessages(messages => [...messages, message]);
//     messageService.on('created', onMessageCreated);
//     return function removeListener() {
//       messageService.removeListener('created', onMessageCreated);
//     };
//   }, []);

//   const sendMessage = async message => {
//     return messageService.create({ text: message });
//   };

//   return (
//     <div>
//       <aside className="sidebar col col-3 flex flex-column flex-space-between">
//         <header className="flex flex-row flex-center">
//           <h4 className="font-300 text-center">
//             <span className="font-600 online-count">{users.length}</span> users
//           </h4>
//         </header>

//         <ul className="flex flex-column flex-1 list-unstyled user-list">
//           {users.map(user => <li key={user._id}>
//             <button className="block relative">
//               <img src={user.avatar} alt={user.email} className="avatar" />
//               <span className="absolute username">{user.email}</span>
//             </button>
//           </li>)}
//         </ul>
//         <footer className="flex flex-row flex-center">
//           <button onClick={() => client.logout()} className="button button-primary">
//             Sign Out
//           </button>
//         </footer>
//       </aside>

//       <main className={styles.AdminChatPage}>
//         <h1 className={cx('header-primary', styles.Header)}>Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
//         <PerfectScrollbar>
//           <ChatBox className={styles.ChatBox} messages={messages} />
//         </PerfectScrollbar>
//         <div className={styles.ChatForm}>
//           <ChatForm className={styles.ChatForm} onSubmit={sendMessage} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminChatPage;


