import React ,{useEffect, useState}from 'react'
import { useSocketHook } from '../store/useSocketHok';
import { useWebSocket } from '../store/socketContextProvider';
import {allUsers, clientAndRoom, userAtom,alltherooms} from '../store/allAtoms'
import { useRecoilState, useRecoilValue } from 'recoil';
import ChatterComp from './ChatterComp';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { useGetUsers } from '../hooks/useAllusers';
import { useNavigate } from 'react-router-dom';
export interface user{
  id :number,
  name:string,
  email:string,
  password:string
}
const Chats = () => {
  useAuthRedirect()
  const navigate=useNavigate();
  const socket =useWebSocket();
  // // const users=useRecoilValue(allUsers)
  // const  users=useGetUsers();
  const User=useRecoilValue(userAtom)
  const [rooms,setRooms]=useRecoilState(alltherooms)
  const [users,setUsers]=useRecoilState(allUsers);
  const fetchAllUsers=async()=>{
    try{
        const response =await fetch(`http://localhost:3000/user`,{
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        })
        if(response.ok){
            //get the currentUser out from that array 
            const jsonedData=await response.json();
            // console.log(jsonedData)
            const userss=jsonedData.users.filter((d:any)=>d.id!==User?.id)
            setUsers(userss);
        }else{
            console.log(`failed to fetch userss`)
        }
    }catch(err){
        console.log(err)
    }
}
const fetchRooms=async()=>{
  try{
    const response= await fetch(`http://localhost:3000/user/getRooms`,{
      method:"GET",
      headers:{
       'Content-Type': 'application/json',
      },
      credentials:'include'
    })
    if(response.ok){
      const jsonedData=await response.json();
      console.log(jsonedData);
      setRooms(jsonedData)
    }else{
      console.log(`failed to fetch the rooms`)
    }
  }catch(err){
    console.log(err)
  }
}
  useEffect(()=>{
    fetchAllUsers();
    fetchRooms();
   if(socket){
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      switch(message.type){
        case "JOIN_ROOM":
        console.log(message);
        navigate(`/ultimateChat?roomID=${message.roomID}`)
      }
    }
   }
  },[socket])
  const AllDataofClientsAndRoom=useRecoilValue(clientAndRoom) 
  return (
    <div className='bg-slate-800 p-6  items-center min-h-screen grid grid-cols-3'>
      <div className='col-span-2 h-full p-4 border-2 '>
      <div className='grid grid-cols-4 gap-2  '>
      {users&&users.map((item:user)=>{
        return <ChatterComp data={item} key={item.id}/>
      })}
      {users&&JSON.stringify(users)} 
      </div>
      </div>
      <div className='h-full p-4 border-2 '>
      <div className='text-white'>
        {rooms&&JSON.stringify(rooms)}
        allthe rooms where the user is in 
      </div>
      </div>
    </div>

   )

}

export default Chats