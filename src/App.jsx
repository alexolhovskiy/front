
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './home';
import Protected from './protection';
import Game from './game';

function App() {
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
