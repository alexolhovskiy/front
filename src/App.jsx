
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './home';
import Protected from './protection';
import Game from './game';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAuthenticated } from './redux/slices/authSlice';

function App() {
   const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthenticated(token)); // Восстанавливаем авторизацию
    }
  }, []);

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Game/>}/>
            {/* <Route path="/protected" element={<Protected/>}/> */}
        </Routes>
    </BrowserRouter>
  )
}

export default App
