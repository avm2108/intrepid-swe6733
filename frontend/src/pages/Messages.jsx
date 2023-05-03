import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from './Messages.module.css';
import axios from 'axios';
import { UserContext } from "../providers/UserProvider";

export default function MessagingPage() {    
    const { chatId, recipientName } = useParams();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const [lastMessage, setLastMessage] = useState(null);
    
    const { user } = React.useContext(UserContext);
    
    const [messages, setMessages] = useState([
        { sender: user.name, recipient: recipientName, content: 'Hi there!' },
        { sender: recipientName, recipient: user.name, content: 'Sup!' },
      ]);
    
    useEffect(
        () => {
            try {
                axios.get("/api/messages/" + chatId).then(res => {
                if (res.status === 200) {
                    setMessages(res.data.messages);
                }
                });
            } catch (err) {
                console.log(err);
            }      
        },
        [lastMessage]
    );
    
      function handleSubmit(event) {
        event.preventDefault();
        const message = { sender: user.name, recipient: recipientName, content: newMessage };
        try {
            axios.post("/api/messages/" + chatId, { content: newMessage }).then(res => {
            if (res.status === 201) {
                setLastMessage(message);
                setMessages([...messages, message]);
                setNewMessage('');
            }
            });
        } catch (err) {
            console.log(err);
        } 
      }
    
      function handleChange(event) {
        setNewMessage(event.target.value);
      }
    
      return (
        <>
        <Helmet>
                <title>Intrepid - Chat</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
        </Helmet>

        <div className={styles.messagingContainer}>
            <div className={styles.topContainer}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>{'< Back'}</button>
                <div className={styles.recipientName}>{recipientName}</div>
            </div>
            <div className={styles.chatContainer}>

          {messages.map(message => (
            <div
            key={message.id}
            className={`${styles.chatBubble} ${
            message.sender === user.name ? styles.sender : styles.recipient
            }`}
          >
              <p>{message.content}</p>
            </div>
          ))}
            </div>

          <form className={styles.sendMessage} onSubmit={handleSubmit}>
            <input className={styles.typeMessage} placeholder="Write your message" type="text" value={newMessage} onChange={handleChange} />
            <button className={styles.sendBttn} type="submit">Send</button>
          </form>
        </div>
      </>
      );
}
