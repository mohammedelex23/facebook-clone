import configs from "../api/configs";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import authHelpers from "../helpers/authHelpers";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";

///////////////////////////////////////////////
export default ({ userId }) => {
  const { pathname } = useLocation();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        let friends = await userApi.getUserFriends(userId);
        setFriends(friends);
        console.log(friends);
      } catch (error) {}
    };
    getFriends();
  }, [userId]);

  return (
    <ul className="flex justify-center bg-gray-200 mt-4 p-2 gap-[10px] max-h-[370px] overflow-y-auto flex-wrap">
      {friends.length > 0 &&
        friends.map((user, index) => (
          <li key={index} className="h-fit  bg-white p-2">
            {/* avatar and name */}
            <div className="text-center">
              {/* image */}
              <div className="w-[60px] mx-auto">
                <Link
                  state={`${pathname}?id=${userId}`}
                  to={`/user?id=${user._id}`}
                >
                  <img
                    crossOrigin="anonymous"
                    src={`${configs.apiBaseUrl}/users/${user._id}/photo`}
                    alt=""
                  />
                </Link>
              </div>
              {/* name */}
              <span
                className="block mt-1 font-medium w-[100px] h-[45px] overflow-y-clip"
                // className="mt-1 block font-medium w-[100px] truncate ... text-ellipsis"
              >
                {user.name}
              </span>
            </div>
          </li>
        ))}
    </ul>
  );
};
