import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import { useSelector,useDispatch } from 'react-redux'
import { login } from '../../features/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux';


function Login() {
    const [formData,setFormData] = useState({});
    const [toggleLoginWithEmail,setToggleLoginWithEmail] = useState(false);
    const navigate = useNavigate();
    const initialState = {
        username:'',
        email:'',
        password:''
    };

  

    const dispatch = useDispatch();
    const handleSubmit = async (e)=>{
        e.preventDefault(); 
        dispatch(login({
            username: formData.username,
            email:formData.email,
            password:formData.password
        })) 
        resetForm();
        navigate('/');
    }
    
    const resetForm = ()=>{
        
        setFormData(initialState);
    
    }
   
    const handleChange = (e)=>{
        const name  = e.target.name;
        const value = e.target.value;
        setFormData(formData=> ({...formData,[name]:value}));


    }



  return (
   <div className="min-w-96 absolute top-1/3 left-1/3">
   <div className='flex flex-col items-center justify-center w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center space-y-2'>
       {!toggleLoginWithEmail &&  <div className='w-full'>
            <label  className='label pb-4'>
                <span className='label-text'>Username  </span>
            </label>
            <input type="text" name="username" value={formData.username || ""} onChange={handleChange} placeholder='Username' className='w-full focus:outline-slate-500 h-10 rounded-md py-4 my-1 px-2'/>

         </div>
}
        {toggleLoginWithEmail  &&  <div className='w-full'>
         <label  className='pb-4'>
            <span className=''>Email </span>
        </label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange}  className='w-full focus:outline-slate-500 h-10 rounded-md py-4 my-1 px-2' placeholder='Email'/>

         </div>  
        }
         <div className='w-full'>
         <label  className='label pb-4'>
            <span className='text-base label-text'> Password </span>
        </label>
            <input type="password" name="password"  value={formData.password || ""}onChange={handleChange} className='w-full focus:outline-slate-500 h-10 rounded-md py-4 my-1 px-2' placeholder='Password'/>
         </div> 
         <span onClick={()=>setToggleLoginWithEmail(!toggleLoginWithEmail)} className='hover:cursor-pointer underline underline-offset-1 text-blue-500  hover:text-blue-600'>{toggleLoginWithEmail?<div>Login with Username</div>:<div>Login with Email</div>} </span>
         <button type="submit" className='w-full rounded-md bg-blue-600 text-white my-4 h-10 hover:bg-blue-700'>Login</button> 

    </form>
   </div>
   </div>
  )
}

export default Login