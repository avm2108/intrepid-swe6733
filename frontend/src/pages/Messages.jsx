import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from './Messages.module.css';
import axios from 'axios';
import { UserContext } from "../providers/UserProvider";
import { toast } from "react-hot-toast";

export default function MessagingPage() {
    const { recipientId, recipientName } = useParams();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const [lastMessage, setLastMessage] = useState(null);
    const [imageState, setImageState] = useState({ 
        chatImage: null,
        chatImageName: "",
    });

    const { user } = React.useContext(UserContext);

    const [messages, setMessages] = useState([
        { sender: user.name, recipient: recipientName, content: 'Hi there!', image: "https://via.placeholder.com/100" },
        { sender: recipientName, recipient: user.name, content: 'Sup!' },
    ]);

    useEffect(() => {
        try {
            axios.get(`/api/messages/${recipientId}`).then(res => {
                if (res.status === 200) {
                    setMessages(res.data?.messages);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }, [lastMessage]);

    function handleChange(event) {
        setNewMessage(event.target.value);
    }

    const handleImageChange = (e) => {
        const { files } = e.target;
        console.log("Changed to : " + e.target?.files[0]?.name )
        setImageState({ chatImage: files[0] ?? {}, chatImageName: files[0]?.name || "" });
    }

    const handleRemoveImage = () => {
        setImageState({ chatImage: null, chatImageName: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure that the user has entered a message
        if (newMessage === "" && (imageState.chatImage === null || imageState.chatImageName === "")) {
            toast.error("Please enter a message or select an image to send.");
            return;
        }
        // Represent the form's data as a FormData object because we need to send files 
        // in addition to JSON data while maintaining the multipart/form-data content type
        const formData = new FormData();

        // Append chat text fields to formData as JSON
        // Exclude chatImage since we need it appended as files
        const chatContent = { content: newMessage };
        formData.append("chatContent", JSON.stringify(chatContent));
        
        // Append chatImage to formData as file
        formData.append("chatImage", imageState.chatImage);

        // Create message object to add to messages array
        const message = { sender: user.name, recipient: recipientName, content: newMessage, image: imageState?.chatImageName, readDate: null };
        try {
            axios.post(`/api/messages/${recipientId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },

            }).then(res => {
                if (res.status === 201) {
                    setLastMessage(message);
                    setMessages([...messages, message]);
                    // Clear form fields
                    setNewMessage('');
                    setImageState({ chatImage: null, chatImageName: "" });
                } else {
                    toast.error("Error sending message, please try again.");
                }
            });
        } catch (err) {
            console.log(err);
            toast.error("Error sending message, please try again.");
        }

    }
    
    return (
        <>
            <Helmet>
                <title>Intrepid - Chat</title>
            </Helmet>

            <div className={styles.messagingContainer}>
                <div className={styles.topContainer}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>{'< Back'}</button>
                    <div className={styles.recipientName}>{recipientName}</div>
                </div>
                <div className={styles.chatContainer}>
                    {messages?.map(message => (
                        <div key={message?.id || message?.content} className={`${styles.chatBubble} ${message.sender === user.name ? styles.sender : styles.recipient}`}>
                            {message?.image && <img src={message?.image} className={styles.chatImage} width="100" height="100" alt="Chat Image" />}
                            {message?.content && <p>{message?.content}</p>}
                        </div>
                    ))}
                </div>

                <form className={styles.sendMessage} onSubmit={handleSubmit}>
                    <input className={styles.typeMessage} placeholder="Write your message" type="text" value={newMessage} onChange={handleChange} />
                    <label htmlFor="chatImage" className={styles.chatImageAddBtn}>
                        {imageState?.chatImageName ? "Change Image" : "Add Image"}
                        <input type="file" id="chatImage" name="chatImage" onChange={(e) => handleImageChange(e)} style={{ display: "none" }} />
                    </label>
                    <button className={styles.sendBttn} type="submit">Send</button>
                </form>

                {imageState?.chatImageName && (
                    <>
                        <h3 className={styles.formHeader}>Preview your image</h3>
                        <div className={styles.chatImgContainer}>
                            <img src={URL.createObjectURL?.(imageState?.chatImage)} width="125" height="125" alt="Chat Image" />
                            <button onClick={e => handleRemoveImage(e)}>Remove Image</button>
                        </div>
                    </>)}
            </div>
            {/* {JSON.stringify(imageState) + JSON.stringify(messages)} */}
        </>
    );
}
