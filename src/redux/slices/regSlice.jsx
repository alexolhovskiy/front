import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchApi } from "../fetch";

export const regUser = createAsyncThunk(
  'reg/regUser',
  async ({ username, password,email,r_password,color }, thunkAPI) => {
    try {
      return await fetchApi('/api/register', 'POST', { username, password,email,r_password,color });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const regSlice = createSlice({
  name: 'reg',
  initialState: {
    message:null,
    error:null,
  },
  reducers: {
    // logout: (state) => {
    //   state.token = null;
    //   state.user = null;
    //   localStorage.removeItem('token');
    // },
    // setToken: (state, action) => {
    //   state.token = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(regUser.fulfilled, (state, action) => {
        state.message=action.payload;
        state.error = null;
      })
      .addCase(regUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// export const { logout, setToken } = authSlice.actions;
export default regSlice.reducer;
