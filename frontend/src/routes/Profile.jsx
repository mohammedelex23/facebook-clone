import UserAvatar from "../components/UserAvatar";
import UserFriends from "../components/UserFriends";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import userApi from "../api/userApi";
import authHelpers from "../helpers/authHelpers";
import UserPosts from "../components/UserPosts";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorComp } from "../components/ErrorComp";
import Modal from "../components/Modal";
import {
  deleteFriendshipRequest,
  selectLocalUser,
  updateLocalUser,
} from "../redux/slices/localUserSlice";
import { SocketContext } from "../context/contexts";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../components/hooks/useApi";
import configs from "../api/configs";
import { useQueryClient } from "react-query";

export default () => {
  const queryClient = useQueryClient();
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("FRIENDSHIP_REQUESTS", async (type, userId) => {
      // queryClient.invalidateQueries("friendshipRequests");
      // update localUser
      try {
        if (Object.keys(localUser)) {
          // if empty object
          localUser = authHelpers.getLocalUser();
        }
        let { friends, outgoingRequests, incommingRequests } =
          await userApi.getUser(localUser._id);
        let savedUser = authHelpers.getLocalUser();
        let temp = {
          ...savedUser,
          friends,
          outgoingRequests,
          incommingRequests,
        };
        authHelpers.authenticateUser(temp);
        // setLocalUser(temp);
        // console.log("incomming friendship", temp);
        dispatch(updateLocalUser(temp));
        // console.log(
        //   "updateLocalUser Home",
        //   authHelpers.getLocalUser(),
        //   localUser
        // );
        // queryClient.invalidateQueries("users");
        // dispatch(renderSearchResults());
        queryClient.invalidateQueries("friendshipRequests");
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("CREATE_POST", () => {
      queryClient.invalidateQueries("posts");
    });
    socket.on("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE", () => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries("friends");
      queryClient.invalidateQueries("friendshipRequests");
    });
  }, [socket]);

  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    // if empty object
    localUser = authHelpers.getLocalUser();
  }
  // check for id and find user
  const [search, setSearch] = useSearchParams();
  let userId = search.get("id");

  const [openModal, setOpenModal] = useState(false);

  const [values, setValues] = useState({
    error: null,
    isLoading: false,
    user: null,
    compToShow: "posts",
  });

  const location = useLocation();

  useEffect(() => {
    // check for user using userId
    const getUser = async () => {
      try {
        let user = await userApi.getUser(userId);
        setValues({
          ...values,
          user,
          isLoading: false,
          error: null,
          compToShow: "posts",
        });
      } catch (error) {
        // show error message
        if (error.type === "UserNotFound") {
          setValues({
            ...values,
            user: null,
            isLoading: false,
            error: "User is not found",
            compToShow: "posts",
          });
        } else {
          setValues({
            ...values,
            user: null,
            isLoading: false,
            error: "Something went wrong",
            compToShow: "posts",
          });
        }
      }
    };
    getUser();
  }, [userId]);

  const dispatch = useDispatch();
  const { isError, isLoading, data, disabled, makeApiCall } = useApi();

  const modalFunc = async (e) => {
    let user = values.user;
    try {
      let obj = { requestId: user._id };

      let res = await makeApiCall(
        `${configs.apiBaseUrl}/users/${localUser._id}/deleteFriendshipRequest`,
        obj
      );

      socket.emit("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE");

      // send socket event
      socket.emit("FRIENDSHIP_REQUESTS", "deleteFriendshipRequest", user._id);
      authHelpers.updateLocalUser(res);
      dispatch(deleteFriendshipRequest(user._id));
      setOpenModal(false);
    } catch (err) {
      setOpenModal(false);
      console.log(err);
    }
  };

  const showPostsOrFriends = (type) => () => {
    if (type === "posts") {
      //&& values.compToShow === "friends"
      setValues({
        ...values,
        compToShow: "posts",
      });
    }
    if (type === "friends") {
      //&& values.compToShow === "posts"
      setValues({
        ...values,
        compToShow: "friends",
      });
    }
  };

  return (
    <div className="relative min-h-[100%] bg-gray-300 md:w-[60%] md:mx-auto  lg:w-[50%] lg:w-[40%]">
      {openModal && (
        <Modal
          func={modalFunc}
          setOpenModal={setOpenModal}
          message="Are you sure to unfriend ?"
        />
      )}
      {values.isLoading && <div>Loading...</div>}
      {values.error && (
        <div className="text-center pt-12">
          <ErrorComp error={values.error} />
          <Link replace className="text-blue-600 underline" to="/home">
            return to home
          </Link>
        </div>
      )}
      {values.user && (
        <div className="p-3">
          {/* return button */}
          <Link to={location.state || ".."}>
            <FontAwesomeIcon color="blue" icon={faArrowLeft}></FontAwesomeIcon>
          </Link>
          {/* user avatar */}
          <UserAvatar setOpenModal={setOpenModal} user={values.user} />

          {/* navigation */}
          <nav className="flex justify-center mt-10 gap-[30px]">
            {/* posts  */}
            <div className="flex flex-col">
              <span
                onClick={showPostsOrFriends("posts")}
                className="select-none cursor-pointer text-xl font-medium text-"
              >
                Posts
              </span>
              {values.compToShow === "posts" && (
                <span className="bg-blue-600 w-[50px] mt-[-3px] h-[5px]"></span>
              )}
            </div>
            {/* friends */}
            <div className="flex flex-col">
              <span
                onClick={showPostsOrFriends("friends")}
                className="select-none cursor-pointer text-xl font-medium text-"
              >
                Friends
              </span>
              {values.compToShow === "friends" && (
                <span className="bg-blue-600 w-[66px] mt-[-3px] h-[5px]"></span>
              )}
            </div>
          </nav>

          {/* posts or friends component */}
          {values.compToShow === "posts" && <UserPosts localUser={localUser} />}
          {values.compToShow === "friends" && <UserFriends userId={userId} />}
        </div>
      )}
    </div>
  );
};
