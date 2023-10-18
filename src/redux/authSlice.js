import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {

        currentUser: {
            data : null,
        },

        login: {
            
            isFetching: false,
            error: false,
            success: false,
            
        },

        

        register: {
            isFetching: false,
            error: false,
            success: false,
        },

        
    },

    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },

        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.currentUser.data = action.payload;
            state.login.error = false;
            state.login.success = true;
            
        },
        isAuth : (state,action) => {
            state.login.success = action.payload;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },

        registerSucces: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.success = false;
            state.register.error = true;
            
        },

        logoutSucces: (state) => {
            state.currentUser.data = null;
            state.login.success = false;
        },
    },
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSucces,
    registerFailed,
    isAuth,
    logoutSucces,
} = authSlice.actions;

export default authSlice.reducer;
