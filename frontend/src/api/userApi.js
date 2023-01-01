import configs from "./configs";

const getUser = async (userId, query) => {
  try {
    let url = query
      ? `${configs.apiBaseUrl}/users/${userId}${query}`
      : `${configs.apiBaseUrl}/users/${userId}`;
    let res = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
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

const getAllusers = async (search) => {
  let res = await fetch(`${configs.apiBaseUrl}/users?search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  res = await res.json();
  return res;
};

const getUserFriends = async (userId, token) => {
  let res = await fetch(`${configs.apiBaseUrl}/users/${userId}/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  res = await res.json();
  return res;
};
const getUserfriendshipRequests = async (userId, token) => {
  let res = await fetch(
    `${configs.apiBaseUrl}/users/${userId}/incommingRequests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    }
  );
  res = await res.json();
  return res;
};

const getUserConversations = async (userId) => {
  try {
    let res = await fetch(
      `${configs.apiBaseUrl}/conversations/userConversations/${userId}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
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

///////////////////////// messages //////////////////
const sendMessage = async (message) => {
  try {
    let res = await fetch(`${configs.apiBaseUrl}/conversations`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    throw error;
  }
};
const getMessages = async (firstUser, secondUser) => {
  try {
    let res = await fetch(
      `${configs.apiBaseUrl}/conversations/userConversation?firstUser=${firstUser}&secondUser=${secondUser}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    throw error;
  }
};

export default {
  getUser,
  getAllusers,
  getUserFriends,
  getUserfriendshipRequests,
  getUserConversations,
  sendMessage,
  getMessages,
};
