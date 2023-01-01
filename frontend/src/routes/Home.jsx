import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePollHorizontal,
  faUserGroup,
  faMagnifyingGlass,
  faMessage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import { Loading } from "../components/Loading";
import { useEffect } from "react";
import { useState } from "react";
import { UserStatus } from "../components/UserStatus";
import { Posts } from "../components/Posts";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useContext } from "react";
import { PostIdContext, SocketContext } from "../context/contexts";
import userApi from "../api/userApi";
import authHelpers from "../helpers/authHelpers";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendshipRequest,
  cancelFriendshipRequest,
  sendFriendshipRequest,
  deleteFriendshipRequest,
  selectLocalUser,
  updateLocalUser,
} from "../redux/slices/localUserSlice";

export const Home = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }
  const { selectedPostId } = useContext(PostIdContext);

  const [values, setValues] = useState({
    isLoading: false,
    indicatorIsReady: false,
    indicatorStyle: {
      marginLeft: "",
    },
  });

  const changeRouteIndicatorPosition = (path) => {
    switch (path) {
      case "/home":
        setValues({
          ...values,
          indicatorIsReady: true,
          indicatorStyle: {
            marginLeft: "0%",
          },
        });
        break;
      case "/home/friends":
        setValues({
          ...values,
          indicatorIsReady: true,
          indicatorStyle: {
            marginLeft: "20%",
          },
        });
        break;
      case "/home/search":
        setValues({
          ...values,
          indicatorIsReady: true,
          indicatorStyle: {
            marginLeft: "40%",
          },
        });
        break;
      case "/home/messages/user":
      case "/home/messages":
        setValues({
          ...values,
          indicatorIsReady: true,
          indicatorStyle: {
            marginLeft: "60%",
          },
        });
        break;
      case "/home/menu":
        setValues({
          ...values,
          indicatorIsReady: true,
          indicatorStyle: {
            marginLeft: "80%",
          },
        });
        break;
      default:
        break;
    }
  };

  const localUserActions = {
    acceptFriendshipRequest,
    sendFriendshipRequest,
    cancelFriendshipRequest,
    deleteFriendshipRequest,
  };
  useEffect(() => {
    if (pathname === "/home") {
      setValues({
        ...values,
        isLoading: true,
      });
    } else {
      setValues({
        ...values,
        isLoading: false,
      });
    }
    changeRouteIndicatorPosition(pathname);
  }, [pathname]);
  useEffect(() => {
    socket.on("FRIENDSHIP_REQUESTS", async (type, userId) => {
      // queryClient.invalidateQueries("friendshipRequests");
      // update localUser
      try {
        if (Object.keys(localUser)) {
          // if empty object
          localUser = authHelpers.getLocalUser();
        }
        let {
          friends,
          outgoingRequests,
          incommingRequests,
        } = await userApi.getUser(localUser._id);
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

  const handleClick = (e) => {
    document.body.addEventListener("click", function (e) {
      if (
        selectedPostId &&
        !e.target.hasAttribute("postoption") &&
        !e.target?.hasAttribute("elepsis")
      ) {
        let postOption = document.getElementById(selectedPostId);
        if (postOption?.style.visibility === "visible") {
          postOption.style.visibility = "hidden";
        }
      }
    });
  };

  return (
    <div
      onClick={handleClick}
      className="min-h-full  md:bg-gray-300 md:w-[60%] md:mx-auto  lg:w-[50%] lg:w-[40%]"
    >
      {/* title */}
      <h1 className="py-2 tracking-wide bg-blue-600 font-bold  text-white text-center text-2xl">
        Facebook
      </h1>
      {/* navigation */}
      <ul className="relative flex border bg-white border-bottom-gray-1 gap-[20px] px-3 py-2">
        <li className="w-[20%] text-center">
          <Link to="/home" onClick={() => changeRouteIndicatorPosition("home")}>
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faSquarePollHorizontal}
              color="gray"
            />
          </Link>
        </li>
        <li className="relative w-[20%] text-center">
          <Link to="/home/friends">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faUserGroup}
              color="gray"
            />
          </Link>
          {/* circular badge */}
          {localUser?.incommingRequests?.length > 0 && (
            <span className="absolute rounded-[50%] top-[-5px] p-[.2em] win-w[.9em] text-center text-white bg-red-600 border-radius-[50%]">
              {localUser?.incommingRequests?.length}
            </span>
          )}
        </li>
        <li className="w-[20%] text-center">
          <Link to="/home/search">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faMagnifyingGlass}
              color="gray"
            />
          </Link>
        </li>
        <li className="w-[20%] text-center">
          <Link to="/home/messages">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faMessage}
              color="gray"
            />
          </Link>
        </li>
        <li className="w-[20%] text-center">
          <Link to="/home/menu">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faBars}
              color="gray"
            />
          </Link>
        </li>
        {/* thick route indicator */}
        {/* 20px 19 39 57 76*/}
        {values.indicatorIsReady && (
          <div id="route_indicator" style={values.indicatorStyle}></div>
        )}
      </ul>
      {/* routes */}
      {pathname !== "/home" && (
        <div>
          <Outlet />
        </div>
      )}

      {/* inside home page */}
      {pathname === "/home" && (
        <ProtectedRoute>
          <div className="px-5 mt-3">
            <UserStatus />
            <Posts />
          </div>
        </ProtectedRoute>
      )}
    </div>
  );
};
