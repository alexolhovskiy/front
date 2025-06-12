import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./redux/slices/refreshTokenSlice"; // твой
import { useDispatch } from "react-redux";

export const connectSocket = async (dispatch) => {
  let token = localStorage.getItem("token");

  // ⏳ Проверяем истёк ли
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        console.log("🔁 Токен истёк. Обновляем...");

        const action = await dispatch(refreshAccessToken());

        if (refreshAccessToken.fulfilled.match(action)) {
          console.log("✅ Токен обновлён перед сокетом");
          token = localStorage.getItem("token");
        } else {
          console.log("❌ Ошибка обновления токена перед сокетом");
          return;
        }
      }
    } catch (err) {
      console.error("Ошибка при декодировании токена", err);
      return;
    }
  } else {
    console.warn("❌ Нет токена в localStorage");
    return;
  }

  // ✅ Подключаемся с актуальным токеном
  const socket = io('wss://game-socket-4.onrender.com',{//"http://localhost:5000", {
    auth: {
      token: token,
    },
    transports: ['websocket'],
  });

  socket.on("connect", () => {
    console.log("🟢 WebSocket подключён");
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket отключён");
  });

  return socket;
};
