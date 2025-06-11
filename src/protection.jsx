import { useEffect, useState } from 'react';
import { fetchApi } from './redux/fetch';
import { Header } from './parts/header';
import { Footer } from './parts/footer';
import { useDispatch } from 'react-redux';
import { refreshAccessToken } from './redux/slices/refreshTokenSlice';

function Protected() {
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const data = await fetchApi('/api/protected', 'GET');
        setMsg(data.message);
      } catch (err) {
        console.log('❌ Access token недействителен. Пробуем обновить...');

        // 👉 Пытаемся обновить access_token
        try {
          const action = await dispatch(refreshAccessToken());

          // Если refresh прошёл успешно:
          if (refreshAccessToken.fulfilled.match(action)) {
            console.log('✅ Токен обновлён, повторяем запрос');
            const data = await fetchApi('/api/protected', 'GET');
            setMsg(data.message);
          } else {
            setMsg('❌ Сессия истекла. Войдите заново.');
          }
        } catch (refreshErr) {
          console.log('❌ Ошибка при обновлении токена:', refreshErr);
          setMsg('❌ Сессия истекла. Войдите заново.');
        }
      }
    };

    fetchProtected();
  }, [dispatch]);

  return (
        <>
            <Header/> 
            <div className='container'>{msg}</div>;
            <Footer/>
        </>
    )
          
}

export default Protected;
