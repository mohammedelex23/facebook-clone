import { useQuery } from "react-query";
import postApi from "../api/postApi";
import authHelpers from "../helpers/authHelpers";
import { ErrorComp } from "./ErrorComp";
import { Loading } from "./Loading";
import { Post } from "./Post";
import { useState } from "react";
import { useContext } from "react";
import { PostIdContext } from "../context/contexts";

export const Posts = () => {
  const localUser = authHelpers.getLocalUser();
  const [prevId, setPrevId] = useState("");
  const { setSelectedPostId } = useContext(PostIdContext);

  const { isError, isLoading, data, error } = useQuery("posts", () =>
    postApi.getUserAndFriendsPosts(localUser._id)
  );

  const handleClick = (id) => (e) => {
    if (prevId && prevId !== id) {
      // check previous opened option
      let previous = document.getElementById(prevId);

      if (previous.style.visibility === "visible") {
        previous.style.visibility = "hidden";
      }
    }
    setSelectedPostId(id);
    let currunt = document.getElementById(id);
    currunt.style.visibility === "hidden"
      ? (currunt.style.visibility = "visible")
      : (currunt.style.visibility = "hidden");
    setPrevId(id);
  };

  return (
    <>
      {isError && (
        <div className="text-center p-2">
          <ErrorComp error={error} />
        </div>
      )}
      {isLoading && <Loading />}
      {!isLoading && data?.posts?.map((postInfo, index) => (
        <div key={index}>
          <Post
            postInfo={postInfo}
            userName={data.name}
            handleClick={handleClick}
            userId={localUser._id}
          />
        </div>
      ))}
    </>
  );
};
