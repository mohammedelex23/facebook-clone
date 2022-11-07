import jwt_decode from "jwt-decode";

const authenticateUser = (token) => {
  localStorage.setItem("user", JSON.stringify({ token }));
};

const isAuthenticated = () => {
  // read token from local storage
  let user = localStorage.getItem("user");

  if (user) {
    user = JSON.parse(user);

    try {
      let decoded = jwt_decode(user.token);

      if (Date.now() >= decoded.exp * 1000 + 60000) {
        // if token expires
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

export default { authenticateUser, isAuthenticated };
