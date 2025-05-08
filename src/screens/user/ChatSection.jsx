import React, { useState, useEffect, useRef } from "react";
import ChatContainer from "../../components/ChatContainer";
import socketIO from "socket.io-client";
import axios from "axios";

const socket = socketIO.connect("https://ecommerce-backend-gr3e.onrender.com");

const SOCKET_URL = "https://ecommerce-backend-gr3e.onrender.com";
const BASE_URL = "http://localhost:8000/api";

const ChatSection = () => {
  const [chatterNames, setChatterNames] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [talkerName, setTalkerName] = useState("");
  const socketRef = useRef(null);

  const user1Id = localStorage.getItem("userId");
  const accesstoken = JSON.parse(localStorage.getItem("access_token"));
  useEffect(() => {
    if (!socket) return;

    // Join the user's room for real-time messaging
    socket.emit("join", user1Id);

    // Listen for incoming messages
    socket.on("receive message", (msg) => {
      console.log("Received message via socket:", msg);

      // Only add messages relevant to this chat
      if (msg.senderId === user1Id || msg.receiverId === user1Id) {
        setBackendMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    // Clean up socket listener on unmount
    return () => {
      socket.off("receive message");
    };
  }, [socket, user1Id, customerId]);

  const getChattersList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/fetch-recipients?loggedInUserId=${user1Id}`,
        {
          headers: { Authorization: "Bearer " + accesstoken },
        }
      );
      const chatters = response.data.data || [];

      // Filter out duplicates
      const uniqueChatters = chatters.filter(
        (item, index, self) =>
          self.findIndex((obj) => obj.id === item.id) === index
      );

      setChatterNames(uniqueChatters);
    } catch (err) {
      console.error("Error fetching chatters:", err);
    }
  };

  useEffect(() => {
    if (!user1Id) return;

    // Create socket connection
    const socket = socketIO(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
    });

    socketRef.current = socket;

    socket.emit("join", user1Id);

    // Clear any previous listener before adding a new one
    socket.off("receive message").on("receive message", (data) => {
      console.log("Socket message received:", data);
      getChattersList(); // Fetch new chatters on every new message
    });

    getChattersList(); // Initial load

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [user1Id]);

  return (
    <>
      <div className="chat-container">
        <div className="inside-chat-container">
          <div className="title-chats">Seller Chat Area</div>
          {chatterNames.length > 0 ? (
            <div className="chat-name-list">
              {chatterNames.map((item) => (
                <div
                  key={item.id}
                  className="each-chatter-name"
                  onClick={() => {
                    setCustomerId(item.id);
                    setTalkerName(item.userName);
                  }}
                >
                  {item.userName}
                </div>
              ))}
            </div>
          ) : (
            <div className="font-medium mt-6 mx-5 bg-yellow-100 p-5">
              <h1>
                No customer has sent a text for product inquiries. If customers
                text regarding product inquiries, they will be visible here.
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="chat-bhitra-other-part">
        <ChatContainer customerId={customerId} talkerName={talkerName} />
      </div>
    </>
  );
};

export default ChatSection;
