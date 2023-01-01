import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { Link } from "react-router-dom";
import configs from "../api/configs";

export default ({ userId, lastMessage, localUser }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        let user = await userApi.getUser(userId, "?name=true");
        setUser(user);
      } catch (error) {}
    };
    getUser();
  }, [userId]);

  return (
    <Link
      state={{
        name: user.name,
        firstUser: localUser._id,
        secondUser: userId,
      }}
      to={`/home/messages/user`}
    >
      {user && (
        <div className="flex bg-white p-2">
          {/* img */}
          <div className="w-[55px] mr-2">
            <img src={`${configs.apiBaseUrl}/users/${userId}/photo`} alt="" />
          </div>
          {/* name and last message */}
          <div>
            <span className="block text-blue-600 font-medium">{user.name}</span>
            {lastMessage.from === userId ? ( // check if it is not localUser message
              <span className="text-sm font-medium">{lastMessage.message}</span>
            ) : (
              <span className="text-sm text-gray-600">
                {lastMessage.message}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};
