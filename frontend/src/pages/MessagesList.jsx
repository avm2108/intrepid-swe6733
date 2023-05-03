import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import styles from './MessagesList.module.css';
import axios from 'axios';

export default function MessagingList() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        try {
            axios.get("/api/matches").then(res => {
                if (res.status === 200) {
                    const chats = res.data?.map(targetUser => {
                        console.log(targetUser);
                        return {
                            name: targetUser?.name,
                            id: targetUser?.id
                        }
                    });
                    setChats(chats);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    function handleChatClick(chat) {
        // handle opening the chat with the given recipient
        console.log(`Opening chat with ${chat.name}`);
    }

    return (
        <>
            <Helmet>
                <title>Intrepid - Messages</title>
            </Helmet>

            <div className={styles.chatListContainer}>
                <h2 className={styles.messagesHeader}>Messages</h2>
                <ul className={styles.chatList}>
                    {chats?.length > 0 ? (
                        chats?.map((chat, idx) => (
                            <li key={`${chat.id || chat.name}${idx}`} onClick={() => handleChatClick(chat)}>
                                {chat.id && chat.name ?
                                    <>
                                        <Link className={styles.chatLink} to={`/messages/${chat.id}/${chat.name}`}>{chat.name}</Link>
                                        <p>{'>'}</p>
                                    </>
                                : null}
                            </li>
                        ))
                    ) : (
                        <p className={styles.noChats}>No chats yet!</p>
                    )}
                </ul>
            </div>
        </>
    );
}
