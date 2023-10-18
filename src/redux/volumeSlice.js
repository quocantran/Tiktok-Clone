import { createSlice } from "@reduxjs/toolkit";

const volumeSlice = createSlice({
    name : 'volume',
    initialState : {
        value : 0,
        muted : true,
    },
    reducers : {
        changeVolume : (state,action) => {
            state.value = action.payload;
            
        },
        changeMuted : (state,action) => {
            state.muted = action.payload
        }
    }
})

export const {
    changeVolume,
    changeMuted,
} = volumeSlice.actions;

export default volumeSlice.reducer;