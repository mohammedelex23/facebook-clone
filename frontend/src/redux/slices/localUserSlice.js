import { createSlice } from "@reduxjs/toolkit";
import authHelpers from "../../helpers/authHelpers";

const localUserSlice = createSlice({
  name: "localUser",
  initialState: authHelpers.getLocalUser() || {},
  reducers: {
    initializeLocalUser: (state, action) => {
      authHelpers.authenticateUser(action.payload);
      if (action.payload) {
        // state = action.payload;
        state._id = action.payload._id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.gender = action.payload.gender;
        state.isAdmin = action.payload.isAdmin;
        state.dateOfBirth = action.payload.dateOfBirth;
        state.createdAt = action.payload.createdAt;
        state.updatedAt = action.payload.updatedAt;
        state.isVerified = action.payload.isVerified;
        state.friends = action.payload.friends;
        state.incommingRequests = action.payload.incommingRequests;
        state.outgoingRequests = action.payload.outgoingRequests;
      }
    },
    updateLocalUser: (state, action) => {
      if (action.payload) {
        state.friends = action.payload.friends;
        state.incommingRequests = action.payload.incommingRequests;
        state.outgoingRequests = action.payload.outgoingRequests;
      }
    },
    acceptFriendshipRequest: (state, action) => {
      if (action.payload) {
        // remove userId from incomming
        state.incommingRequests = state.incommingRequests.filter(
          (id) => id !== action.payload
        );
        // add userId to friends
        state.friends.push(action.payload);
      }
    },
    sendFriendshipRequest: (state, action) => {
      if (action.payload) state.outgoingRequests.push(action.payload);
    },
    cancelFriendshipRequest: (state, action) => {
      if (action.payload)
        state.outgoingRequests = state.outgoingRequests.filter(
          (id) => id !== action.payload
        );
    },
    deleteFriendshipRequest: (state, action) => {
      if (action.payload)
        state.friends = state.friends.filter((id) => id !== action.payload);
    },
  },
});

export const {
  acceptFriendshipRequest,
  sendFriendshipRequest,
  cancelFriendshipRequest,
  deleteFriendshipRequest,
  initializeLocalUser,
  updateLocalUser,
} = localUserSlice.actions;
export const selectLocalUser = (state) => state.localUserReducer;
export default localUserSlice.reducer;
