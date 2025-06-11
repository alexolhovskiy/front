import { configureStore } from "@reduxjs/toolkit";
import simpleReducer from './slices/simpleSlice';
import authReducer from './slices/authSlice';
import regReducer from './slices/regSlice';
import refreshTokenReducer from './slices/refreshTokenSlice';

const store=configureStore({
    reducer:{
        hello:simpleReducer,
        auth:authReducer,
        reg:regReducer,
        refresh:refreshTokenReducer,
    }
})

export default store;