import { configureStore } from "@reduxjs/toolkit";
import localUserReducer from "./slices/localUserSlice";
import globalReducer from "./slices/globalSlice";

const store = configureStore({
  reducer: { localUserReducer, globalReducer },
});

export default store;
