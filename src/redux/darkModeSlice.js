import { createSlice } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
    name : 'theme',
    initialState : {
        dark : false
    },

    reducers : {
        setTheme : (state,action) => {
            state.dark = action.payload;
        }
    }

})

export const {
    setTheme
} = darkModeSlice.actions;

export default darkModeSlice.reducer