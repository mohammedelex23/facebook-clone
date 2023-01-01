import configs from "./configs";

const getUserAndFriendsPosts = async (userId) => {
  let res = await fetch(
    `${configs.apiBaseUrl}/posts/userAndFriendsPosts/${userId}`,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
    }
  );
  res = await res.json();
  return res;
};

const getUserPosts = async (userId) => {
  try {
    let res = await fetch(`${configs.apiBaseUrl}/posts/userPosts/${userId}`, {
      method: "get", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    let res = await fetch(`${configs.apiBaseUrl}/posts/${postId}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const createPost = (newPost) => {
  return fetch(`${configs.apiBaseUrl}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
};
const likePost = ({ postId, userId }) => {
  return fetch(`${configs.apiBaseUrl}/posts/${postId}/like`, {
    method: "Put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
};

const dislikePost = ({ postId, userId }) => {
  return fetch(`${configs.apiBaseUrl}/posts/${postId}/dislike`, {
    method: "Put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
};
export default {
  getUserAndFriendsPosts,
  deletePost,
  createPost,
  likePost,
  dislikePost,
  getUserPosts,
};
