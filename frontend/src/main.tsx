import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from './store/socketContextProvider.tsx'
import { ToastContainer, toast } from 'react-toastify';
createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <App />
    <ToastContainer/>
  </RecoilRoot>,
)
