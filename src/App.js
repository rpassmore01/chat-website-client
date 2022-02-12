import { useEffect, useState } from "react";
import "./index.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [messageElements, setMessageElements] = useState();
  const [roomInput, setRoomInput] = useState("");

  function addMessage(msgContent) {
    const tempMessages = messages;
    tempMessages.push(msgContent);
    setMessages(tempMessages);
  }

  useEffect(() => {
    socket.on("connect", () => {
      addMessage(`You are connected at ${socket.id}`);
      updateMessageElements();
    });

    socket.on("receive-message", (obj) => {
      addMessage(obj.message);
      updateMessageElements();
    });
  }, [socket]);

  function updateMessageElements() {
    setMessageElements(
      messages.map((message, key) => (
        <p key={key} className="message">
          {message}
        </p>
      ))
    );
  }

  function sendMessageToServer() {
    socket.emit("send-message", { message: input }, roomInput);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.length !== 0) {
      addMessage(input);
      updateMessageElements();
      setInput("");
      sendMessageToServer();
    }
  }

  function handleJoin() {
    socket.emit("join-room", roomInput);
  }

  return (
    <div className="app-container">
      <header>
        <h2>Messages</h2>
      </header>

      <div className="message-container" id="message-container">
        {messageElements}
      </div>
      <div className="message-input">
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            type="text"
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <button type="submit">send</button>
          <input
            value={roomInput}
            type="text"
            onChange={(e) => setRoomInput(e.target.value)}
          ></input>
          <button onClick={handleJoin}>join</button>
        </form>
      </div>
    </div>
  );
}

export default App;
