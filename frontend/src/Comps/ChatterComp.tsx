import React, { useEffect } from 'react'
import { clientDataType, userAtom } from '../store/allAtoms'
import { useWebSocket } from '../store/socketContextProvider'
import { useNavigate } from 'react-router-dom'
import { user } from './Chats'
import { useRecoilValue } from 'recoil'
const ChatterComp = ({data}:{data:user}) => {
    const User=useRecoilValue(userAtom)
    const socket =useWebSocket();
    const navigate =useNavigate();
    const joinRoomer=()=>{
        console.log(`sending message to get into the same room as ${data.name}`)
        socket?.send(JSON.stringify({
            type:"JOIN_ROOM",
            clients:[data.id,User?.id],
            room:data.name+User?.name
        }))
    }
  return (
    <div className='text-white bg-blue-950 w-full h-full border-white p-4 justify-center items-center flex flex-col'>
        <p>{data.name}</p>
        <button onClick={joinRoomer}>
            have chat
        </button>

    </div>
  )
}

export default ChatterComp

//user clicks on the have chat button and a message is sent to the server of having a room if there isnt already one and roomname can be user.name 
//+ the other user.name 