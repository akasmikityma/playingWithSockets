//have all the users inside a state 

import { useEffect } from "react";
import { allUsers,userAtom } from "../store/allAtoms"
import { useRecoilState, useRecoilValue } from "recoil"

export const useGetUsers=()=>{
    const User=useRecoilValue(userAtom)
    const [users,setusers]=useRecoilState(allUsers);
    useEffect(()=>{
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
                    const userss=jsonedData.filter((d:any)=>d.id!==User?.id)
                    setusers(userss);
                }else{
                    console.log(`failed to fetch userss`)
                }
            }catch(err){
                console.log(err)
            }
        }
    },[users,setusers])
    return users
}