import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import authHelpers from "../helpers/authHelpers";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import userApi from "../api/userApi";
import { SocketContext } from "../context/contexts";
import configs from "../api/configs";
export default () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  let localUser = useSelector(selectLocalUser);
  if (!localUser) {
    localUser = authHelpers.getLocalUser();
  }

  const socket = useContext(SocketContext);
  let timer = null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [visibility, setVisibility] = useState("hidden");
  useEffect(() => {
    socket.on("sendMessage", (msgObj) => {
      const getMessages = async () => {
        try {
          let messages = await userApi.getMessages(
            state?.firstUser,
            state?.secondUser
          );
          setMessages(messages);
        } catch (error) {
          console.log(error);
        }
      };
      getMessages();
    });
    socket.on("user is typing", (userId) => {
      if (userId === state.secondUser) {
        setVisibility("visible");
      }
    });
    socket.on("user is not typing", (userId) => {
      console.log("typign");
      if (userId === state.secondUser) {
        setVisibility("hidden");
      }
    });
  }, [socket]);

  useEffect(() => {
    if (!state || Object.keys(state).length === 0) {
      navigate(-1);
    }
    const getMessages = async () => {
      try {
        let messages = await userApi.getMessages(
          state?.firstUser,
          state?.secondUser
        );
        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, []);

  useEffect(() => {
    let messagesList = document.getElementById("messages");
    messagesList.scrollTop = messagesList.scrollHeight;
  }, [messages]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !message.trim()) return;
    let refindedMessage = message.trim();
    let msgObj = {
      _id: messages.length + 1,
      from: state.firstUser,
      to: state.secondUser,
      message: refindedMessage,
    };
    setMessages([...messages, msgObj]);
    setMessage("");
    // call the sendMessage ednpoint

    let res = await userApi.sendMessage(msgObj);

    // send socket event with msgObj
    socket.emit("sendMessage", msgObj);
  };

  const handleKey = (name) => (e) => {
    if (name === "down") {
      socket.emit("user is typing", localUser._id);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        socket.emit("user is not typing", localUser._id);
      }, 2000);
    }
  };

  return (
    <div className="absolute w-[100%] bg-blue-100 flex flex-col gap-[10px] pb-[10px] h-[calc(100vh-94px)]">
      {/* message header */}
      <div className="flex items-center px-4 py-2 shadow-md bg-blue-500">
        {/* return arrow */}
        <Link to="/home/messages">
          <FontAwesomeIcon
            className="text-white cursor-pointer mr-2"
            icon={faArrowLeft}
          />
        </Link>
        {/* name and emage */}
        <div className="flex items-center">
          <div className="w-[40px] h-[40px] mr-2">
            <img
              src={`${configs.apiBaseUrl}/users/${state.secondUser}/photo`}
              alt=""
            />
          </div>
          <div className="">
            <span className="text-white block">{state.name}</span>
            <span
              style={{ visibility: visibility }}
              className="text-green-200 text-sm mt-[-5px] block"
            >
              Typing...
            </span>
          </div>
        </div>
      </div>

      {/* message body */}
      <ul id="messages" className="flex-grow overflow-auto p-2">
        {messages.length > 0 &&
          messages.map((msg) => (
            <li
              className={`${
                localUser._id === msg.from && "ml-auto"
              } bg-purple-800 text-white font w-fit max-w-[80%] mb-2 p-4 rounded-lg`}
              key={msg._id}
            >
              <p>{msg.message}</p>
            </li>
          ))}
      </ul>

      {/* message footer */}
      <form
        onSubmit={handleSubmit}
        className="px-2 w-full flex gap-2 left-0 bottom-[15px]"
      >
        {/* input text */}
        <input
          onKeyDown={handleKey("down")}
          onKeyUp={handleKey("up")}
          value={message}
          onChange={handleChange}
          className="block px-2 py-1 w-[80%] border border-1 border-black"
          type="text"
          placeholder="write something"
        />
        {/* send button */}
        <button type="submit" className="bg-blue-600 text-white w-[20%] block">
          Send
        </button>
      </form>
    </div>
  );
};
