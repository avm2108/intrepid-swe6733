import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from './Messages.module.css';

export default function MessagingPage() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Alice', recipient: 'Bob', content: 'Hi Bob!' },
        { id: 2, sender: 'Bob', recipient: 'Alice', content: 'Hi Alice!' },
      ]);
    
      const { chatId } = useParams();
      const navigate = useNavigate();
    // const chatData = // fetch chat data from API or other data source using chatId

      const [newMessage, setNewMessage] = useState('');
      const [recipientName, setRecipientName] = useState('Bob');
    
      function handleSubmit(event) {
        event.preventDefault();
        const message = { sender: 'Alice', recipient: 'Bob', content: newMessage };
        setMessages([...messages, message]);
        setNewMessage('');
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
                {/* {chatData.recipientName} */}
                <div className={styles.recipientName}>{recipientName}</div>
            </div>
            <div className={styles.chatContainer}>

          {messages.map(message => (
            <div
            key={message.id}
            className={`${styles.chatBubble} ${
            message.sender === 'Alice' ? styles.sender : styles.recipient
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
