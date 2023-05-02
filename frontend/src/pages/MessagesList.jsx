import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import styles from './MessagesList.module.css';
import axios from 'axios';

export default function MessagingList() {
    const [chats, setChats] = useState([]);
      
    useEffect(
        () => {
            try {
                axios.get("/api/matches").then(res => {
                if (res.status === 200) {
                    setChats(res.data);
                }
                });
            } catch (err) {
                console.log(err);
            }      
        },
        []
    );
    
      function handleChatClick(chat) {
        // handle opening the chat with the given recipient
        console.log(`Opening chat with ${chat.name}`);
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
                <li key={chat._id} onClick={() => handleChatClick(chat)}>
                    <Link className={styles.chatLink} to={`/messages/${chat._id}/${chat.name}`}>{chat.name}</Link>
                    <p>{'>'}</p>
                </li>
                ))}
            </ul>
            </div>
        </>
      );
}
