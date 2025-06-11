import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApi } from '../fetch';
import { logout, setToken } from './authSlice'; 


// 🌀 Асинхронный thunk для обновления токена
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Нет refresh токена');
      }

      // Временный хак — подменяем Bearer токен в headers
      const originalToken = localStorage.getItem('token');
      localStorage.setItem('token', refreshToken); // 👈 Временно подменили токен

      const data = await fetchApi('/api/refresh', 'POST');

      localStorage.setItem('token', originalToken); // 👈 Вернули старый токен (или null)

      // Сохраняем новый access_token
      localStorage.setItem('token', data.access_token);

      // ✅ Обновляем Redux-состояние:
      thunkAPI.dispatch(setToken(data.access_token));

      return data.access_token;

    } catch (err) {
      thunkAPI.dispatch(logout()); // 👉 вызываем logout при ошибке
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🧊 Slice
const refreshTokenSlice = createSlice({
  name: 'refresh',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default refreshTokenSlice.reducer;
