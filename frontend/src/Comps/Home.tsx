import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../store/socketContextProvider';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {clientAndRoom, userAtom} from '../store/allAtoms'
import useAuthRedirect from '../hooks/useAuthRedirect';
const Home = () => {
  useAuthRedirect();
  const User=useRecoilValue(userAtom)
  const navigate = useNavigate();
  const socket = useWebSocket();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [allClientsdata,setAllClientsData]=useRecoilState(clientAndRoom)
  useEffect(() => {
    if (socket) {
        socket.onmessage=(event)=>{
           const message=JSON.parse(event.data);
           switch(message.type){
               case "CLIENT_LIST":
               console.log(JSON.stringify(message.data))
               setDexcu(message.data)
               break;
               case "MESSAGE":
                console.log(`messageData`, message.data);
                //@ts-ignore
                // setallthemessages(prevMessages => [...prevMessages, {
                //   id: prevMessages.length + 1,
                //   owner: 'other',
                //   data: message.data
                // }]);
                break;
               default:
                console.log(message.type);
           }
        }
    }
  }, [socket,name]); // Depend on the socket state
  
  const setDexcu=(data:any)=>{
      console.log('inside the setDexcu method')
      const newData=data.filter((d:any)=>d.name!==name)
      console.log(`newData: `,newData)
      console.log(`name: `,name)
      setAllClientsData(newData)
  }

  const sendMessageForDashboardENTRY = () => {
    socket?.send(
      JSON.stringify({
        type: 'toDashboard',
        user : User,
        room: room,
      })
    );
    navigate('/chats');
  };

  return (
    <div className='bg-slate-900 text-white flex justify-center items-center min-h-screen'>
      <div className='flex flex-col gap-3 p-4 items-center bg-blue-900 shadow-lg shadow-blue-700 rounded-md'>
        <input
          type='text'
          placeholder='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='p-2 rounded-md bg-white/30 text-black'
        />
        <input
          type='text'
          placeholder='Room name'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className='p-2 rounded-md bg-white/30 text-black'
        />
        <button
          className='p-2 bg-blue-950 rounded-lg mt-4'
          onClick={sendMessageForDashboardENTRY}
        >
          Get to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;

