import { useContext } from "react";
import configs from "../api/configs";
import authHelpers from "../helpers/authHelpers";
import { LocalUserContext, SocketContext } from "../context/contexts";
import { useApi } from "../components/hooks/useApi";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendshipRequest,
  deleteFriendshipRequest,
  selectLocalUser,
} from "../redux/slices/localUserSlice";

export const UserProfile = ({ user, btnType }) => {
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }
  const socket = useContext(SocketContext);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { disabled, makeApiCall } = useApi();

  const handleRemove = async (e) => {
    try {
      let obj = { requestId: user._id };

      let res = await makeApiCall(
        `${configs.apiBaseUrl}/users/${localUser._id}/deleteFriendshipRequest`,
        obj
      );
      queryClient.invalidateQueries("friends");
      // UPDATE_POSTS_ON_FRIENDSHIP_UPDATE
      socket.emit("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE");

      // send socket event
      socket.emit("FRIENDSHIP_REQUESTS");
      authHelpers.updateLocalUser(res);
      // update local user
      dispatch(deleteFriendshipRequest(res.userId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (e) => {
    try {
      let obj = { requestId: user._id };

      let res = await makeApiCall(
        `${configs.apiBaseUrl}/users/${localUser._id}/acceptFriendshipRequest`,
        obj
      );
      queryClient.invalidateQueries("friendshipRequests");
      queryClient.invalidateQueries("friends");
      // UPDATE_POSTS_ON_FRIENDSHIP_UPDATE
      socket.emit("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE");

      // send socket event
      socket.emit("FRIENDSHIP_REQUESTS");
      authHelpers.updateLocalUser(res);
      dispatch(acceptFriendshipRequest(res.userId));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <li className="flex justify-between items-center mb-2">
      {/* first item */}
      <div className="flex">
        {/* image */}
        <div className="w-[40px] mr-2">
          <img
            crossOrigin="anonymous"
            src={`${configs.apiBaseUrl}/users/${user._id}/photo`}
            alt=""
          />
        </div>
        {/* user name */}
        <h4 className="font-medium">{user.name}</h4>
      </div>
      {/* second item */}
      <div>
        {btnType === "remove" ? (
          <button
            onClick={handleRemove}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-red-500 text-white px-2"
          >
            remove
          </button>
        ) : (
          <button
            onClick={handleAccept}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-blue-600 w-[70px] text-white px-2"
          >
            confirm
          </button>
        )}
      </div>
    </li>
  );
};
