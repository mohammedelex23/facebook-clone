const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const authenticateUser = require("../middlewares/authenticateUser");

router.get("/", userCtrl.allUsers);

router.put("/:userId/incomingRequests", authenticateUser);

router
  .route("/:userId")
  .get(authenticateUser, userCtrl.getOneUser)
  .put(authenticateUser, userCtrl.updateUser)
  .delete(authenticateUser, userCtrl.deleteUser);

// update image in seperate route
router
  .route("/:userId/photo")
  .get(
    // authenticateUser,
     userCtrl.getUserPhoto, userCtrl.defaultImage)
  .put(
    // authenticateUser, 
    userCtrl.uploadPhoto);

// send friendship request
router.put(
  "/:userId/sendFriendshipRequest",
  // authenticateUser,
  userCtrl.sendFriendshipRequest
);

// accept friendship request
router.put(
  "/:userId/acceptFriendshipRequest",
  // authenticateUser,
  userCtrl.acceptFriendshipRequest
);

// cancel friendship request
router.put(
  "/:userId/cancelFriendshipRequest",
  authenticateUser,
  userCtrl.cancelFriendshipRequest
);

// delete friendship request
router.put(
  "/:userId/deleteFriendshipRequest",
  authenticateUser,
  userCtrl.deleteFriendshipRequest
);

// get IncommingFriendshipRequests
router.get(
  "/:userId/incommingRequests",
  authenticateUser,
  userCtrl.getIncommingFriendshipRequests
);

// get friends
router.get("/:userId/friends", authenticateUser, userCtrl.getFriends);
module.exports = router;
