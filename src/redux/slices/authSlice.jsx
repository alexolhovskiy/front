import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchApi } from "../fetch";

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      return await fetchApi('/api/login', 'POST', { email, password });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    },
    setAuthenticated: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
        state.user = 'Logged in';
        state.error = null;
        state.isAuthenticated=true;
        console.log(state.isAuthenticated,state.user)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { logout, setToken,setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
