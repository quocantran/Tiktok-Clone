import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "route",
  initialState: {
    routes: ["/"],
  },

  reducers: {
    addRoute: (state, action) => {
      //check if action.payload is in the routes array, delete it and push it to the end of the array
      const index = state.routes.indexOf(action.payload);
      if (index !== -1) {
        state.routes.splice(index, 1);
      }
      state.routes.push(action.payload);
    },
    removeRoute: (state) => {
      state.routes = [];
    },
  },
});

export const { addRoute, removeRoute } = authSlice.actions;

export default authSlice.reducer;
