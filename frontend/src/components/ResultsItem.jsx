import { useEffect, useState } from "react";
import configs from "../api/configs";
import authHelpers from "../helpers/authHelpers";
import { useApi } from "./hooks/useApi";
import userMethods from "../socket/userMethods";
import { useContext } from "react";
import { LocalUserContext, SocketContext } from "../context/contexts";
import userApi from "../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendshipRequest,
  sendFriendshipRequest,
  cancelFriendshipRequest,
  deleteFriendshipRequest,
  selectLocalUser,
} from "../redux/slices/localUserSlice";
import { Link } from "react-router-dom";

export const ResultsItem = ({ user }) => {
  const localUserActions = {
    acceptFriendshipRequest,
    sendFriendshipRequest,
    cancelFriendshipRequest,
    deleteFriendshipRequest,
  };
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const { isError, isLoading, data, disabled, makeApiCall } = useApi();

  const [userStatus, setUserStatus] = useState("");

  const updateUserStatus = (friends, incommingRequests, outgoingRequests) => {
    if (friends.includes(user._id)) {
      setUserStatus("friends");
    } else if (incommingRequests.includes(user._id)) {
      setUserStatus("incommingRequests");
    } else if (outgoingRequests.includes(user._id)) {
      setUserStatus("outgoingRequests");
    } else {
      setUserStatus("new");
    }
  };

  useEffect(() => {
    if (Object.keys(localUser)) {
      localUser = authHelpers.getLocalUser();
    }
    updateUserStatus(
      localUser.friends,
      localUser.incommingRequests,
      localUser.outgoingRequests
    );
  }, [localUser]); // updateUserStatus, localUser

  const handleBtnClick = (type) => async (e) => {
    // add, cancel, remove,accept
    try {
      let obj = { receiverId: user._id };
      if (
        type === "acceptFriendshipRequest" ||
        type === "deleteFriendshipRequest"
      ) {
        obj = { requestId: user._id };
      }
      //  else if (type === "cancelFriendshipRequest") {
      //   obj = { requestId: user._id };
      // }
      let res = await makeApiCall(
        `${configs.apiBaseUrl}/users/${localUser._id}/${type}`,
        obj
      );
      // UPDATE_POSTS_ON_FRIENDSHIP_UPDATE
      if (
        type === "acceptFriendshipRequest" ||
        type === "deleteFriendshipRequest"
      ) {
        socket.emit("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE");
      }
      // send socket event
      socket.emit("FRIENDSHIP_REQUESTS", type, user._id);
      let updatedUser = authHelpers.updateLocalUser(res);

      updateUserStatus(
        updatedUser.friends,
        updatedUser.incommingRequests,
        updatedUser.outgoingRequests
      );
      dispatch(localUserActions[type](user._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      {/* first item */}
      <div className="flex">
        {/* image */}
        <div className="w-[40px] mr-2">
          <Link state="/home/search" to={`/user?id=${user._id}`}>
          <img
            crossOrigin="anonymous"
            src={`${configs.apiBaseUrl}/users/${user._id}/photo`}
            alt=""
          />
          </Link>
        </div>
        {/* user name */}
        <h4 className="font-medium">{user.name}</h4>
      </div>
      {/* second item */}
      <div>
        {userStatus === "friends" && (
          <button
            onClick={handleBtnClick("deleteFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-red-500 text-white px-2"
          >
            unfriend
          </button>
        )}
        {userStatus === "incommingRequests" && (
          <button
            onClick={handleBtnClick("acceptFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-blue-600 w-[70px] text-white px-2"
          >
            confirm
          </button>
        )}
        {userStatus === "outgoingRequests" && (
          <button
            onClick={handleBtnClick("cancelFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-gray-400 text-white px-2"
          >
            cancel
          </button>
        )}
        {userStatus === "new" && (
          <button
            onClick={handleBtnClick("sendFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="bg-blue-600 w-[70px] text-white px-2"
          >
            add +
          </button>
        )}
      </div>
    </div>
  );
};
