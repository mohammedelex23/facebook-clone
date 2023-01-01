import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import configs from "../api/configs";
import authHelpers from "../helpers/authHelpers";
import { DeletePrompt } from "./DeletePrompt";
import { PostOptions } from "./PostOptions";
import "./Post.css";

import postApi from "../api/postApi";
import { useMutation, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import { Link, useLocation } from "react-router-dom";

/////////////////////////////////////////////////////////////////
export const Post = ({ postInfo, userName, userId, handleClick }) => {
  let localUser = useSelector(selectLocalUser);
  if (!localUser) {
    localUser = authHelpers.getLocalUser();
  }

  const location = useLocation();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(postInfo.likes.includes(localUser._id));
  }, [location.pathname, postInfo]);

  const queryClient = useQueryClient();

  const likePostMutation = useMutation(
    (data) => {
      return postApi.likePost(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts", postInfo);
        setIsLiked(true);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const dislikePostMutation = useMutation(
    (data) => {
      return postApi.dislikePost(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts", postInfo);
        setIsLiked(false);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const handleLikeClick = (e) => {
    if (isLiked) {
      dislikePostMutation.mutate({
        postId: postInfo._id,
        userId,
      });
    } else {
      likePostMutation.mutate({
        postId: postInfo._id,
        userId,
      });
    }
  };

  return (
    <div className="mt-2 bg-white relative">
      {/* header */}
      <div className="p-3 flex justify-between">
        {/* avatr */}
        <div className="flex">
          {/* image */}
          <div className="w-[50px]">
            <Link
              state={`${location.pathname}?id=${userId}`}
              to={`/user?id=${postInfo.user._id}`}
            >
              <img
                className="w-full"
                src={`${configs.apiBaseUrl}/users/${postInfo.user._id}/photo`}
                alt=""
              />
            </Link>
          </div>
          {/* name and date */}
          <div className="ml-2 flex flex-col">
            <span className="font-medium">{postInfo.user.name}</span>
            <span className="text-gray-500 mt-[-5px]">
              {new Date(postInfo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {/* post options */}

        <div
          elepsis="something"
          id={`${postInfo._id}elepsis`}
          onClick={handleClick(postInfo._id)}
          className="elipsis"
        >
          <span elepsis="something"></span>
          <span elepsis="something"></span>
          <span elepsis="something"></span>
        </div>
      </div>
      {/* body */}
      <p className="my-3 px-3">{postInfo.post}</p>
      {/* hr */}
      <hr />
      {/* footer */}
      <div className="px-3 py-2 flex">
        <div className="flex-1">
          {isLiked ? (
            <FontAwesomeIcon
              onClick={handleLikeClick}
              className="text-blue-600 cursor-pointer text-2xl"
              icon={faThumbsUp}
            />
          ) : (
            <FontAwesomeIcon
              onClick={handleLikeClick}
              className=" cursor-pointer text-gray-400 text-2xl"
              icon={faThumbsUp}
            />
          )}
        </div>
        <div className="flex-1">
          <FontAwesomeIcon
            className="cursor-pointer text-gray-400 text-2xl"
            icon={faCommentDots}
          />
        </div>
      </div>
      {/* post options */}
      <PostOptions id={postInfo._id} />
    </div>
  );
};
