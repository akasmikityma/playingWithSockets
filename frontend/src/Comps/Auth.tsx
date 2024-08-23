import { data } from '@remix-run/router/dist/utils';
import React ,{useState}from 'react'
import axios from 'axios';
import {toast} from 'react-toastify'

import { useNavigate } from 'react-router-dom';
const Auth = () => {
    const navigate=useNavigate();
    const [name,setname]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [isregistered,setIsregistered]=useState(false);
    const SIGN_or_LOGIN=async()=>{
        if(isregistered){
            try {
                const response = await axios.post(`http://localhost:3000/user/login`, {
                    email, password
                }, {
                    withCredentials: true
                });
                
                if (response.status === 200) {
                    toast.success(response.data.msg);
                    navigate('/');
                }
            } catch (error:any) {
                if (error.response && error.response.status === 401) {
                    toast.error("Authentication failed");
                } else {
                    toast.error("An unexpected error occurred");
                }
            }
        }else{
            const response =await axios.post(`http://localhost:3000/user/signup`,{
                name,email,password
            },
            {
                withCredentials:true
            })
            if(response.data.user){
                navigate('/')
            }
        }
    }
  return (
    <div className='flex justify-center items-center p-4 bg-slate-700 min-h-screen'>
       { !isregistered?(<div className='flex flex-col gap-1 p-4'>
           <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
           <input type="text" value={email} onChange={(e)=>setemail(e.target.value)}/>
           <input type="text" value={password} onChange={(e)=>setpassword(e.target.value)}/>
           <button onClick={SIGN_or_LOGIN}>SignUp</button>
           <button onClick={(e)=>setIsregistered(true)}>login</button>
        </div>):
        (<div className='flex flex-col gap-1 p-4'>
           <input type="text" value={email} onChange={(e)=>setemail(e.target.value)}/>
           <input type="text" value={password} onChange={(e)=>setpassword(e.target.value)}/>
           <button onClick={SIGN_or_LOGIN}>Login</button>
           <button onClick={(e)=>setIsregistered(false)} >signup</button>
        </div>)}
    </div>
  )
}

export default Auth