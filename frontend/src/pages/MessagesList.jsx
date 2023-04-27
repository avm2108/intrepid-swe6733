import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import styles from './MessagesList.module.css';

export default function MessagingList() {
    const [chats, setChats] = useState([
        { id: 1, recipient: 'Bob Bobberson' },
        { id: 2, recipient: 'Charlie Charlieson' },
        { id: 3, recipient: 'David Davidson' },
      ]);
    
      function handleChatClick(chat) {
        // handle opening the chat with the given recipient
        console.log(`Opening chat with ${chat.recipient}`);
      }
    
      return (
        <>
        <Helmet>
                <title>Intrepid - Messages</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
        </Helmet>

            <div className={styles.chatListContainer}>
            <h2 className={styles.messagesHeader}>Messages</h2>
            <ul className={styles.chatList}>
                {chats.map(chat => (
                <li key={chat.id} onClick={() => handleChatClick(chat)}>
                    <Link className={styles.chatLink} to={`/messages/${chat.id}`}>{chat.recipient}</Link>
                    <p>{'>'}</p>
                </li>
                ))}
            </ul>
            </div>
        </>
      );
}
