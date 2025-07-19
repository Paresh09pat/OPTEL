import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            localStorage.setItem("_ouptel_token", action.payload);
            state.token = action.payload;
        },
        setIsLoggedIn: (state) => {
            state.isLoggedIn = localStorage.getItem("_ouptel_token") ? true : false;
        },
        logout: (state) => {
            localStorage.removeItem("_ouptel_token");
            state.isLoggedIn = false;
            state.user = null;
            state.token = localStorage.getItem("_ouptel_token");
        }
    }
})

export const { setUser, setToken, setIsLoggedIn, logout } = authSlice.actions;

export default authSlice.reducer;