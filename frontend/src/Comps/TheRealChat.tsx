import { useRecoilState, useRecoilValue } from 'recoil';
import { useWebSocket } from '../store/socketContextProvider'
import React, { useEffect, useState } from 'react'
import { allmessage } from '../store/allAtoms';
import { useSearchParams } from 'react-router-dom';
import {userAtom} from '../store/allAtoms'
const TheRealChat = () => {
    const socket=useWebSocket();
    const User=useRecoilValue(userAtom)
    const [searchParams, setSearchParams] = useSearchParams();
    const [room,setRoom]=useState({})
    const myParam = searchParams.get('roomID');
    const [msg,setmsg]=useState('');
    const [allthemessages,setallthemessages]=useRecoilState(allmessage)
    useEffect(() => {
      if (socket) {
        console.log('WebSocket connected');
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('Received message:', message); // Add this log to verify receipt
    
          switch (message.type) {
            case "MESSAGE":
              console.log('messageData:', message.data);
              setallthemessages((prev)=>[...prev,message]);
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
        };
      }
    }, [socket]);
    
    // const roomGetter=async()=>{
    //   try{
    //     const response =await fetch(`http://localhost:3000/user/room/${myParam}`,{
    //       method:"GET",
    //       headers:{
    //        'Content-Type': 'application/json',
    //       },
    //       credentials:'include'
    //     })
    //     if(response.ok){
    //       const jsonedData=await response.json();
    //       console.log(`from roomgetter`,jsonedData.theRoom);
          
    //       setRoom(jsonedData.theRoom);
    //     }
    //   }catch(err){
    //     console.log(err)
    //   }
    // }  
    const sendMessage=()=>{
        console.log(`clicked the send with ${msg}`)
        socket?.send(JSON.stringify({
            type:"MESSAGE",
            message:msg,
            roomID:Number(myParam),
            senderId:User?.id
        }))
         //@ts-ignore
        //  setallthemessages(prevMessages => [...prevMessages, {id:prevMessages.length+1,owner:'me',data:msg}]);
         setmsg('')
    }
  return (
    <div className="bg-slate-800 min-h-screen justify-center items-center relative p-0">
    <div className="flex flex-col gap-4 p-8">
      {allthemessages && allthemessages.map((message) => (
        <div
          key={message.data}
          className={`flex ${
            message.senderId === User?.id? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg text-white shadow-md ${
              message.senderId === User?.id
                ? 'bg-blue-600'
                : 'bg-gray-600'
            }`}
          >
            <div className="text-sm opacity-75 mb-1">
              {message.senderId === User?.id? 'You' : 'Other'}
            </div>
            {message.data}
          </div>
        </div>
      ))}
    </div>
    <div className="flex absolute bottom-4 left-0 right-0 flex-row gap-2 items-center p-4">
      <input
        type="text"
        placeholder="message"
        className="flex-grow p-2 text-black font-bold"
        value={msg}
        onChange={(e) => setmsg(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-green-700 border-white p-2 text-white"
      >
        send
      </button>
    </div>
  </div>
  
  )
}

export default TheRealChat