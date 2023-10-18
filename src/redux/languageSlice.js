import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
    name : 'language',

    initialState : {
        languageDefault : 'en',
    },

    reducers : {
        changeLanguage : (state , action) => {
            state.languageDefault = action.payload;
        }
    }
})

export const {
    changeLanguage
} = languageSlice.actions;

export default languageSlice.reducer;