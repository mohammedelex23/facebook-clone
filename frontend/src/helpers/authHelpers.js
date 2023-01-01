import jwt_decode from "jwt-decode";
import userApi from "../api/userApi";

const authenticateUser = (user) => {
  localStorage.setItem("user", JSON.stringify({ ...user }));
};

const isAuthenticated = async () => {
  // read token from local storage
  let user = localStorage.getItem("user");

  if (user) {
    // if user is found on local storage
    user = JSON.parse(user);
    try {
      let decoded = jwt_decode(user.token);

      if (Date.now() >= decoded.exp * 1000 + 60000) {
        // if token expires
        return false;
      }
      // check the user existence in the server

      let foundUser = await userApi.getUser(user._id);
      if (!foundUser) {
        return false;
      }
      // update user in local storage
      authenticateUser(user);
      return true;
    } catch (error) {
      // remove user from local storage
      localStorage.removeItem("user");
      return false;
    }
  } else {
    // if user is not found on local storage
    return false;
  }
};

const getLocalUser = () => {
  let user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const updateLocalUser = (data) => {
  const { userId, type } = data;
  let user = getLocalUser();
  if (user) {
    // incommingRequests;
    // outgoingRequests;
    // friends;
    let updatedUser = { ...user };
    switch (type) {
      case "accept":
        // remove userId from incomming
        updatedUser.incommingRequests = updatedUser.incommingRequests.filter(
          (id) => id !== userId
        );
        // add userId to friends
        updatedUser.friends.push(userId);
        break;
      case "send":
        updatedUser.outgoingRequests.push(userId);
        break;
      case "cancel":
        updatedUser.outgoingRequests = updatedUser.outgoingRequests.filter(
          (id) => id !== userId
        );
        break;
      case "remove":
        updatedUser.friends = updatedUser.friends.filter((id) => id !== userId);
        break;
      default:
        break;
    }

    authenticateUser(updatedUser);
  }

  return getLocalUser();
};

export default {
  authenticateUser,
  isAuthenticated,
  getLocalUser,
  updateLocalUser,
};
