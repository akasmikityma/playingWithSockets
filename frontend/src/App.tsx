import React ,{useEffect, useState}from 'react'
import { useSocketHook } from './store/useSocketHok';
import { useWebSocket, WebSocketProvider } from './store/socketContextProvider';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Chats from './Comps/Chats';
import Home from './Comps/Home';
import TheRealChat from './Comps/TheRealChat';
import Chat from './Comps/Chat';
import Auth from './Comps/Auth';
const App = () => {
  return (
    <WebSocketProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Chats/>}/>
        {/* <Route path='/' element={<Home/>}/> */}
        <Route path='/ultimateChat' element={<TheRealChat/>}/> 
        <Route path='/example' element={<Chat/>}/>   
        <Route path='auth' element={<Auth/>}/>    
      </Routes>
    </Router>
    </WebSocketProvider>
  )
}

export default App