// это основной компонент нашего приложения; 
// Он содержит логику для рендеринга маршрутов и получения данных с сервера.

import './App.css';
import { Routes, Route } from 'react-router-dom';
import {LoginPage} from "./pages/LoginPage";
import {SignUpPage} from './pages/SignUpPage'
import {RegFormPage} from './pages/RegFormPage';
import {ProfilePage} from './pages/ProfilePage';
import {ChatPage} from './pages/ChatPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}> 
    <>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/signUp" element={<SignUpPage/>} />
        <Route path="/registration" element={<RegFormPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
   </>
   </LocalizationProvider>
  );
}

export default App; 
