import { useContext, useState } from "react";
import configs from "../api/configs";
import authHelpers from "../helpers/authHelpers";
import { ErrorComp } from "./ErrorComp";
import { useMutation, useQueryClient } from "react-query";
import postApi from "../api/postApi";
import { LocalUserContext, SocketContext } from "../context/contexts";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import store from "../redux/index";
import { Link } from "react-router-dom";
export const UserStatus = () => {
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser).length === 0) {
    localUser = authHelpers.getLocalUser();
  }

  const socket = useContext(SocketContext);

  const queryClient = useQueryClient();

  const [post, setPost] = useState("");
  const [postFieldError, setPostFieldError] = useState({
    error: null,
    style: { border: "2px solid #9ca3af" },
  });
  const [showPostedSuccess, setShowPostedSuccess] = useState(false);

  const newPostMutaion = useMutation(
    (newPost) => {
      return postApi.createPost(newPost);
    },
    {
      retry: 3,
      onSuccess: () => {
        // Invalidate and refetch
        setShowPostedSuccess(true);
        setTimeout(() => {
          setShowPostedSuccess(false);
        }, 1000);
        setPost("");
        queryClient.invalidateQueries("posts");
        socket.emit("CREATE_POST");
      },
    }
  );

  const handleChange = (e) => {
    setPost(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // check post is empty
    if (!post || !post?.trim()) {
      setPostFieldError({
        style: {
          border: "2px solid #ff0000",
        },
        error: "Post is empty",
      });
      return;
    }
    // everything is ok: ready for calling api
    setPostFieldError({
      style: {
        border: "2px solid #9ca3af",
      },
      error: null,
    });

    let newPost = {
      user: localUser._id,
      userId: localUser._id,
      post,
    };

    newPostMutaion.mutate(newPost);
  };

  return (
    <div className="relative bg-white p-3">
      {newPostMutaion.isError && (
        <center>
          <ErrorComp error="Something went wrong" />
        </center>
      )}
      {/* user image container */}
      <div className="flex items-center">
        <div className="w-[50px]">
          {localUser && localUser._id && (
            <Link to={`/user?id=${localUser._id}`}>
              <img
                className="m-w-full rounded-full mb-1"
                crossOrigin="anonymous"
                src={`${configs.apiBaseUrl}/users/${localUser._id}/photo`}
                alt="profile"
              />
            </Link>
          )}
        </div>
        <h3 className="font-medium ml-2">{localUser.name}</h3>
      </div>
      {/* text area  */}
      <textarea
        value={post}
        style={postFieldError.style}
        onChange={handleChange}
        className="rounded-md w-full resize-none p-2"
        rows="2"
        placeholder="Write something"
      ></textarea>
      {/* empty post error */}
      {postFieldError.error && <ErrorComp error={postFieldError.error} />}
      {/* post button */}
      <div>
        {!newPostMutaion.isLoading ? (
          <button
            onClick={handleSubmit}
            className="ml-auto block bg-blue-600 rounded text-white px-4 py-[2px]"
          >
            POST
          </button>
        ) : (
          <button
            disabled
            onClick={handleSubmit}
            className="ml-auto block bg-gray-400 cursor-not-allowed rounded text-white px-4 py-[2px]"
          >
            POST...
          </button>
        )}
      </div>
      {/* post created successfully */}
      {showPostedSuccess && (
        <div className="absolute top-0 left-0 border-2 border-green-600 rounded px-1 flex justify-center items-center z-index-2 bg-green-300 w-full h-[40px]">
          <p>Created new Post !</p>
        </div>
      )}
    </div>
  );
};
