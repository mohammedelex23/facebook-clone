import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import postApi from "../api/postApi";
import { ErrorComp } from "./ErrorComp";
import { Post } from "./Post";

export default ({ localUser }) => {
  const [search, setSearch] = useSearchParams();
  const userId = search.get("id");

  const [values, setValues] = useState({
    isError: false,
    isLoading: false,
    posts: [],
  });

  useEffect(() => {
    const callApi = async () => {
      try {
        // set loading
        setValues({
          ...values,
          isError: false,
          isLoading: true,
          posts: [],
        });
        let res = await postApi.getUserPosts(userId);
        // set data
        setValues({
          ...values,
          isError: false,
          isLoading: false,
          posts: res,
        });
      } catch (error) {
        setValues({
          ...values,
          isError: error,
          isLoading: false,
          posts: [],
        });
      }
    };
    callApi();
  }, [userId]);

  const handleClick = (id) => (e) => {
    // if (prevId && prevId !== id) {
    //   // check previous opened option
    //   let previous = document.getElementById(prevId);
    //   if (previous.style.visibility === "visible") {
    //     previous.style.visibility = "hidden";
    //   }
    // }
    // setSelectedPostId(id);
    // let currunt = document.getElementById(id);
    // currunt.style.visibility === "hidden"
    //   ? (currunt.style.visibility = "visible")
    //   : (currunt.style.visibility = "hidden");
    // setPrevId(id);
  };

  return (
    <div>
      {values.isError && <ErrorComp error="Something went wrong" />}
      <ul className="h-[370px] bg-gray-200 mt-[10px] overflow-y-auto p-2">
        {values.posts.length > 0 &&
          values.posts.map((post) => (
            <li key={post._id}>
              <Post
                userId={localUser._id}
                postInfo={post}
                userName={post.user.name}
                handleClick={handleClick}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};
