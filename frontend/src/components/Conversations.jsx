import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import authHelpers from "../helpers/authHelpers";
import Conversation from "./Conversation";
export default () => {
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getUserConversations = async () => {
      try {
        let conversations = await userApi.getUserConversations(localUser._id);
        setConversations(
          conversations.sort(
            (x, y) => new Date(y.createdAt) - new Date(x.createdAt)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    getUserConversations();
  }, []);
  return (
    <ul className="px-4 py-2">
      {conversations.length > 0 &&
        conversations.map((conversation) => (
          <li key={conversation._id}>
            <Conversation
              userId={
                localUser._id === conversation.firstUser
                  ? conversation.secondUser
                  : conversation.firstUser
              }
              localUser={localUser}
              lastMessage={conversation.lastMessage}
            />
          </li>
        ))}
    </ul>
  );
};
