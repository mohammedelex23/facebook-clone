const jwt = require("jsonwebtoken");

module.exports = async function getToken(id, isAdmin) {
  try {
    return await jwt.sign({ id, isAdmin }, process.env.SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    throw error;
  }
};
