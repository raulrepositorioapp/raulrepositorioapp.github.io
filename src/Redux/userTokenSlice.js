import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("raaul_TokenData")
  ? JSON.parse(localStorage.getItem("raaul_TokenData"))
  : null;

export const userTokenSlice = createSlice({
  name: "userToken",
  initialState,
  reducers: {
    userToken: (state, action) => {
      localStorage.setItem("raaul_TokenData", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { userToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;
