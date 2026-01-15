import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("raaul_userData")
  ? JSON.parse(localStorage?.getItem("raaul_userData"))
  : null;

export const userDataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userData: (state, action) => {
      state = action.payload;
      localStorage.setItem("raaul_userData", JSON.stringify(action?.payload));
    },
  },
});

export const { userData } = userDataSlice.actions;

export default userDataSlice.reducer;
