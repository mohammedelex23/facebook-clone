import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    renderSearchResults: null,
  },
  reducers: {
    renderSearchResults: (state) => {
      state.renderSearchResults = new Date().toLocaleDateString();
    },
  },
});

export const { renderSearchResults } = globalSlice.actions;
export const selectRenderSearchResults = (state) =>
  state.globalReducer.renderSearchResults;

export default globalSlice.reducer;
