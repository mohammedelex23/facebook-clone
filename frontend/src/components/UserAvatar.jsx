import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import configs from "../api/configs";
import { SocketContext } from "../context/contexts";
import authHelpers from "../helpers/authHelpers";
import { useApi } from "./hooks/useApi";
import {
  acceptFriendshipRequest,
  sendFriendshipRequest,
  cancelFriendshipRequest,
  deleteFriendshipRequest,
  selectLocalUser,
  initializeLocalUser,
} from "../redux/slices/localUserSlice";
import userApi from "../api/userApi";

export default ({ user, setOpenModal }) => {
  let navigate = useNavigate();
  window.onclick = (e) => {
    let dropdown = document.getElementById("dropdown");
    if (!e.target.matches(".dropBtn") && dropdown) {
      dropdown.classList.add("hidden");
    }
  };
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    // if empty object
    localUser = authHelpers.getLocalUser();
  }
  const handleDropBtn = (e) => {
    let dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("hidden");
  };

  const isFriend = () => {
    return localUser.friends.includes(user._id);
  };
  const showAddBtn = () => {
    if (localUser._id === user._id) return false;
    return !(
      localUser.friends.includes(user._id) ||
      localUser.incommingRequests.includes(user._id) ||
      localUser.outgoingRequests.includes(user._id)
    );
  };
  const showCancelBtn = () => {
    return localUser.outgoingRequests.includes(user._id);
  };
  const showConfirmAndIgnore = () => {
    return localUser.incommingRequests.includes(user._id);
  };
  const showSendMessage = () => {
    return localUser.friends.includes(user._id);
  };

  const dispatch = useDispatch();
  const { isError, isLoading, data, disabled, makeApiCall } = useApi();
  const socket = useContext(SocketContext);
  const localUserActions = {
    acceptFriendshipRequest,
    sendFriendshipRequest,
    cancelFriendshipRequest,
    deleteFriendshipRequest,
  };

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
      authHelpers.updateLocalUser(res);
      dispatch(localUserActions[type](user._id));
    } catch (err) {
      userApi.getUser(localUser._id).then((res) => {
        authHelpers.updateLocalUser(res);
        dispatch(initializeLocalUser(res));
        navigate(0);
      });
      console.log(err);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        {/* image container */}
        <div className="w-[150px] h-[150px]">
          <img src={`${configs.apiBaseUrl}/users/${user._id}/photo`} alt="" />
        </div>
        {/* just name */}
        {isFriend() && localUser._id !== user._id ? (
          <>
            {/* name and option */}
            <div className="relative flex justify-between w-[60%] items-center mt-[20px]">
              {/* name */}
              <h3 className="text-lg font-bold">{user.name}</h3>
              {/* options */}
              <div
                onClick={handleDropBtn}
                className="flex cursor-pointer w-[10px] dropBtn flex-col justify-center items-center h-[20px] gap-[3px] "
              >
                <span className="bg-black dropBtn w-[4px] h-[4px] rounded-[50%]"></span>
                <span className="bg-black dropBtn w-[4px] h-[4px] rounded-[50%]"></span>
                <span className="bg-black dropBtn w-[4px] h-[4px] rounded-[50%]"></span>
              </div>
              <div
                id="dropdown"
                className="absolute hidden right-[0px] top-[35px] z-2 bg-white p-2"
              >
                <button
                  onClick={() => setOpenModal(true)}
                  className="text-red-600"
                >
                  unfriend
                </button>
              </div>
            </div>
          </>
        ) : (
          // just name
          <h3 className="text-lg font-bold">{user.name}</h3>
        )}
        {/* add button */}
        {showAddBtn() && (
          <button
            onClick={handleBtnClick("sendFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="mt-2 bg-blue-600 py-1 text-white px-2"
          >
            add friend
          </button>
        )}
        {/* cancel button */}
        {showCancelBtn() && (
          <button
            onClick={handleBtnClick("cancelFriendshipRequest")}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            className="mt-2 bg-gray-400 py-1 text-white px-2"
          >
            cancel request
          </button>
        )}
        {/* confirm and ignor */}
        {showConfirmAndIgnore() && (
          <div className="flex gap-2">
            <button
              onClick={handleBtnClick("acceptFriendshipRequest")}
              disabled={disabled}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              className="mt-2 bg-blue-600 py-1 text-white px-2"
            >
              confirm
            </button>
            <button
              onClick={handleBtnClick("cancelFriendshipRequest")}
              disabled={disabled}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              className="mt-2 bg-gray-400 py-1 text-white px-2"
            >
              ignore
            </button>
          </div>
        )}
        {
          // send message
          showSendMessage() && (
            <Link
              to={`/home/messages/user`}
              state={{
                name: user.name,
                firstUser: localUser._id,
                secondUser: user._id,
              }}
              // onClick={handleBtnClick("sendFriendshipRequest")}
              disabled={disabled}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              className="mt-2 bg-blue-600 py-1 text-white px-2"
            >
              Send message
            </Link>
          )
        }
      </div>
    </div>
  );
};
